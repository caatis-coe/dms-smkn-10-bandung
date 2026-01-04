<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = [
            'sort' => $request->get('sort'),
            'direction' => $request->get('direction', 'asc'),
            'filters' => $request->get('filters', []),
            'per_page' => $request->get('per_page', 25),
            'page' => $request->get('page', 1),
        ];

        $directFilters = ['name'];

        $documentTypes = DocumentType::query()
            ->withCount('documents')
            ->when(
                $query['sort'],
                fn ($q) => $q->orderBy($query['sort'], $query['direction'])
            )
            ->when(true, function ($q) use ($query, $directFilters) {
                foreach ($query['filters'] as $key => $value) {
                    if (! $value) {
                        continue;
                    }

                    if (in_array($key, $directFilters, true)) {
                        $q->where($key, "LIKE", "%{$value}%");
                    }
                }
            })
            ->paginate($query['per_page'])
            ->withQueryString();

        return Inertia::render('document-type/index', [
            'documentTypes' => $documentTypes,
            'query' => $query,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_types,name',
        ]);

        DocumentType::create($validated);

        return back()->with('success', 'Document type created.');
    }

    public function update(Request $request, DocumentType $documentType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_types,name,' . $documentType->id,
        ]);

        $documentType->update($validated);

        return back()->with('success', 'Document type updated.');
    }

    public function destroy(DocumentType $documentType)
    {
        $documentType->delete();

        return back()->with('success', 'Document type deleted.');
    }
}
