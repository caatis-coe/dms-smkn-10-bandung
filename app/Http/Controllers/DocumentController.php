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
            'page' => $request->get('page', 1),
            'per_page' => $request->get('per_page', 10),
        ];

        // 🧩 Which fields are filterable directly?
        $directFilters = [
            'id',
            'name',
            'file_path',
            'created_at',
            'updated_at',
        ];

        // 🧩 Which fields filter through relations?
        $relationFilters = [
            'published_by' => 'publishedBy',
            'last_updated_by' => 'lastUpdatedBy',
        ];

        $documents = Document::query()

            // Sorting
            ->when(
                $query['sort'],
                fn($q) =>
                $q->orderBy($query['sort'], $query['direction'])
            )

            // 🧠 Dynamic Filters
            ->when(true, function ($q) use ($query, $directFilters, $relationFilters) {

                foreach ($query['filters'] as $key => $value) {
                    if (!$value)
                        continue;

                    if (in_array($key, $directFilters)) {
                        $q->where($key, "LIKE", "%{$value}%");
                    }

                    if (array_key_exists($key, $relationFilters)) {
                        $relation = $relationFilters[$key];
                        $q->whereHas($relation, function ($sub) use ($value) {
                            $sub->where('name', "LIKE", "%{$value}%");
                        });
                    }
                }
            })
            ->paginate($query['per_page'])
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
            'file' => 'required|file|mimes:pdf|max:20480',
        ], [
            'id.required' => 'Nomor dokumen wajib diisi.',
            'id.string' => 'Nomor dokumen tidak valid.',
            'id.unique' => 'Nomor dokumen sudah digunakan, silakan pilih yang lain.',

            'name.required' => 'Nama dokumen wajib diisi.',
            'name.string' => 'Nama dokumen tidak valid.',
            'name.max' => 'Nama dokumen terlalu panjang.',

            'file.required' => 'File PDF wajib diunggah.',
            'file.file' => 'File yang diunggah tidak valid.',
            'file.mimes' => 'File harus berupa PDF.',
            'file.max' => 'Ukuran file terlalu besar (maksimum 20MB).',
        ]);

        $path = $request->file('file')->store('documents', 'public');

        Document::create([
            'id' => $validated['id'],
            'name' => $validated['name'],
            'file_path' => $path,
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
            'id'   => 'nullable|string|unique:documents,id,' . $document->id,
            'name' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf|max:20480',
        ], [
            'id.unique' => 'Nomor dokumen sudah digunakan, silakan pilih yang lain.',

            'name.required' => 'Nama dokumen wajib diisi.',
            'name.max' => 'Nama dokumen terlalu panjang.',

            'file.file' => 'File yang diunggah tidak valid.',
            'file.mimes' => 'File harus berupa PDF.',
            'file.max' => 'Ukuran file terlalu besar (maksimum 20MB).',
        ]);

        $data = [
            'id' => $validated['id'],
            'name' => $validated['name'],
            'last_updated_by' => Auth::id(),
        ];

        if ($request->hasFile('file')) {
            if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }

            $data['file_path'] = $request->file('file')->store('documents', 'public');
        }

        $document->update($data);

        return back()->with('success', 'Document updated successfully.');
    }

    public function destroy(Document $document)
    {
        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return back()->with('success', 'Document deleted.');
    }
}
