<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = [
            'sort' => $request->get('sort'),
            'direction' => $request->get('direction', 'asc'),
            'filters' => $request->get('filters', []),
            'per_page' => $request->get('per_page', 10),
        ];

        $directFilters = [
            'id',
            'name',
            'standard',
            'clause',
            'document_type',
            'revision',
        ];

        $relationFilters = [
            'published_by' => 'publishedBy',
            'last_updated_by' => 'lastUpdatedBy',
            'document_owner' => 'owner',
        ];

        $documents = Document::query()
            ->when(
                $query['sort'],
                fn($q) =>
                $q->orderBy($query['sort'], $query['direction'])
            )
            ->when(true, function ($q) use ($query, $directFilters, $relationFilters) {
                foreach ($query['filters'] as $key => $value) {
                    if (!$value)
                        continue;

                    if (in_array($key, $directFilters)) {
                        $q->where($key, 'LIKE', "%{$value}%");
                    }

                    if (array_key_exists($key, $relationFilters)) {
                        $q->whereHas($relationFilters[$key], function ($sub) use ($value) {
                            $sub->where('name', 'LIKE', "%{$value}%");
                        });
                    }
                }
            })
            ->paginate($query['per_page'] ?? 10)
            ->withQueryString();

        return Inertia::render('document/index', [
            'documents' => $documents,
            'query' => $query,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:documents,id',
            'name' => 'required|string|max:255',
            'standard' => 'nullable|string|max:255',
            'clause' => 'nullable|string|max:255',
            'document_type' => 'required|in:prosedur,instruksi,dokumen_lain',
            'document_owner' => 'nullable|exists:group_owners,id',
            'revision' => 'nullable|string|max:50',
            'effective_date' => 'nullable|date',
            'application_link' => 'nullable|url',

            'file' => 'required|file|mimes:pdf|max:20480',
            'supporting_file' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        $filePath = $request->file('file')->store('documents', 'public');

        $supportingPath = null;
        if ($request->hasFile('supporting_file')) {
            $supportingPath = $request
                ->file('supporting_file')
                ->store('supporting-documents', 'public');
        }

        Document::create([
            ...$validated,
            'file_path' => $filePath,
            'supporting_file_path' => $supportingPath,
            'published_by' => Auth::id(),
            'last_updated_by' => Auth::id(),
        ]);

        return redirect()
            ->route('documents.index')
            ->with('success', 'Document uploaded successfully.');
    }


    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'id' => 'nullable|string|unique:documents,id,' . $document->id,
            'name' => 'required|string|max:255',
            'standard' => 'nullable|string|max:255',
            'clause' => 'nullable|string|max:255',
            'document_type' => 'required|in:prosedur,instruksi,dokumen_lain',
            'document_owner' => 'nullable|exists:group_owners,id',
            'revision' => 'nullable|string|max:50',
            'effective_date' => 'nullable|date',
            'application_link' => 'nullable|url',

            'file' => 'nullable|file|mimes:pdf|max:20480',
            'supporting_file' => 'nullable|file|mimes:pdf|max:20480',
            'remove_supporting_file' => 'nullable|boolean',
        ]);

        $data = [
            ...$validated,
            'last_updated_by' => Auth::id(),
        ];

        /* ================= Main File ================= */

        if ($request->hasFile('file')) {
            Storage::disk('public')->delete($document->file_path);
            $data['file_path'] = $request
                ->file('file')
                ->store('documents', 'public');
        }

        /* ================= Supporting File ================= */

        if ($request->boolean('remove_supporting_file')) {
            Storage::disk('public')->delete($document->supporting_file_path);
            $data['supporting_file_path'] = null;
        } else if ($request->hasFile('supporting_file')) {
            Storage::disk('public')->delete($document->supporting_file_path);

            $data['supporting_file_path'] = $request
                ->file('supporting_file')
                ->store('supporting-documents', 'public');
        }

        $document->update($data);

        return back()->with('success', 'Document updated successfully.');
    }


    public function destroy(Document $document)
    {
        Storage::disk('public')->delete([
            $document->file_path,
            $document->supporting_file_path,
        ]);

        $document->delete();

        return back()->with('success', 'Document deleted.');
    }
}
