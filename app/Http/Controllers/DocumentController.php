<?php

namespace App\Http\Controllers;

use App\Models\Config;
use App\Models\Document;
use App\Models\GroupOwner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
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
            'per_page' => $request->get('per_page', 5),
        ];

        $directFilters = [
            'code',
            'name',
            'standard',
            'clause',
            'status',
            'revision',
            'status',
            'effective_date'
        ];

        $relationFilters = [
            'document_owner' => 'owner',
            'document_type' => 'documentType'
        ];

        $exactMatchFilters = [
            'status',
            'document_type',
            'document_owner',
        ];

        $documents = Document::query()
            ->when(
                $query['sort'],
                fn($q) =>
                $q->orderBy($query['sort'], $query['direction'])
            )
            ->when(true, function ($q) use ($query, $directFilters, $relationFilters, $exactMatchFilters) {
                foreach ($query['filters'] as $key => $value) {
                    if (!$value)
                        continue;

                    if (in_array($key, $directFilters)) {
                        if (in_array($key, $exactMatchFilters)) {
                            $q->where($key, $value);
                        } else {
                            $q->where($key, 'LIKE', "%{$value}%");
                        }

                    }

                    if (array_key_exists($key, $relationFilters)) {
                        $q->whereHas($relationFilters[$key], function ($sub) use ($value, $key, $exactMatchFilters) {
                            if (in_array($key, $exactMatchFilters)) {
                                $sub->where('name', $value);
                            } else {
                                $sub->where('name', 'LIKE', "%{$value}%");
                            }
                        });
                    }
                }
            })
            ->paginate($query['per_page'] ?? 10)
            ->withQueryString();

        $documentsCount = Document::query()->count();
        
        $groupOwnerCount = GroupOwner::query()->count();
        $groupOwnerDocumentCount = GroupOwner::leftJoin(
                'documents',
                'group_owners.id',
                '=',
                'documents.document_owner'
            )
            ->select(
                'group_owners.name',
                \DB::raw('COUNT(documents.id) as documents_count')
            )
            ->groupBy('group_owners.name')
            ->get();

        return Inertia::render('document/index', [
            'documentsCount' => $documentsCount,
            'groupOwnerCount' => $groupOwnerCount,
            'groupOwnerDocumentCount' => $groupOwnerDocumentCount,
            'documents' => $documents,
            'query' => $query,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:documents,code',
            'name' => 'required|string|max:255',
            'standard' => 'nullable|string|max:255',
            'clause' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,dicabut,digantikan_oleh_dokumen_lain',
            'document_type' => 'required|exists:document_types,id',
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
            ->route('document.index')
            ->with('success', 'Document uploaded successfully.');
    }


    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:documents,code,' . $document->id,
            'name' => 'required|string|max:255',
            'standard' => 'nullable|string|max:255',
            'clause' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,dicabut,digantikan_oleh_dokumen_lain',
            'document_type' => 'required|exists:document_types,id',
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
            if (
                $document->file_path &&
                Storage::disk('public')->exists($document->file_path)
            ) Storage::disk('public')->delete($document->file_path);

            $data['file_path'] = $request
                ->file('file')
                ->store('documents', 'public');
        }

        /* ================= Supporting File ================= */

        if ($request->boolean('remove_supporting_file')) {
            if (
                $document->supporting_file_path &&
                Storage::disk('public')->exists($document->supporting_file_path)
            ) Storage::disk('public')->delete($document->supporting_file_path);

            $data['supporting_file_path'] = null;
        } else if ($request->hasFile('supporting_file')) {
            if (
                $document->supporting_file_path &&
                Storage::disk('public')->exists($document->supporting_file_path)
            ) Storage::disk('public')->delete($document->supporting_file_path);


            $data['supporting_file_path'] = $request
                ->file('supporting_file')
                ->store('supporting-documents', 'public');
        }

        $document->update($data);

        return back()->with('success', 'Document updated successfully.');
    }

    public function destroy(Document $document)
    {
        $document->delete();

        return back()->with('success', 'Document deleted.');
    }
}
