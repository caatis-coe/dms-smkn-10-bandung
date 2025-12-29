<?php

namespace App\Http\Controllers;

use App\Models\BusinessProcess;
use App\Models\BusinessProcessNode;
use App\Models\GroupOwner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BusinessProcessController extends Controller
{
    public function index(Request $request)
    {

        $query = [
            "group_owner" => $request->input('group_owner') ?? GroupOwner::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->first()->id ?? -99,
            "search" => $request->input('search') ?? ""
        ];

        $search = $query['search'];

        $nodes = BusinessProcessNode::query()
            ->where('group_owner', $query['group_owner'])
            ->whereNull('parent_id')
            ->with([
                'children' => function ($q) use ($search) {
                    $q->orderBy('code')
                        ->with([
                            'processes' => function ($p) use ($search) {
                                $p->orderBy('created_at');

                                if ($search) {
                                    $p->where('name', 'LIKE', "%{$search}%");
                                }
                            }
                        ]);
                }
            ])
            ->orderBy('code')
            ->get()
            ->map(fn($node) => [
                'id' => $node->id,
                'code' => $node->code,
                'name' => $node->name,
                'level' => $node->level,
                'parent_id' => $node->parent_id ?? null,
                'children' => $node->children
                    ->map(fn($child) => [
                        'id' => $child->id,
                        'code' => $child->code,
                        'name' => $child->name,
                        'level' => $child->level,
                        'parent_id' => $child->parent_id ?? null,
                        'processes' => $child->processes->map(fn($process) => [
                            'id' => $process->id,
                            'name' => $process->name,
                            'file_path' => 'storage/' . $process->file_path,
                        ]),
                    ]),
                'processes' => $node->processes->map(fn($process) => [
                    'id' => $process->id,
                    'name' => $process->name,
                    'file_path' => 'storage/' . $process->file_path,
                ])
            ]);

        $topNodes = BusinessProcessNode::query()
            ->where('group_owner', $query['group_owner'])
            ->whereNull('parent_id')
            ->orderBy('order')
            ->with([
                'children' => function ($q) use ($search) {
                    $q->orderBy('order')
                        ->with([
                            'processes' => function ($p) use ($search) {
                                $p->orderBy('order');

                                if ($search) {
                                    $p->where('name', 'LIKE', "%{$search}%");
                                }
                            }
                        ]);
                }
            ])
            ->get();

        return Inertia::render('business-process/index', [
            'query' => $query,
            'nodes' => $nodes,
            'topNodes' => $topNodes,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'node_id' => 'required|exists:business_process_nodes,id',
            'name' => 'required|string',
            'file' => 'required|file',
        ]);

        BusinessProcess::create([
            'business_process_node_id' => $data['node_id'],
            'name' => $data['name'],
            'file_path' => $request->file('file')->store('business-processes', 'public'),
        ]);

        return back();
    }

    public function update(Request $request, BusinessProcess $businessProcess)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'file' => 'nullable|file'
        ]);

        if ($request->hasFile('file')) {
            if (
                $businessProcess->file_path &&
                Storage::disk('public')->exists($businessProcess->file_path)
            )
                Storage::disk('public')->delete($businessProcess->file_path);

            $data['file_path'] = $request
                ->file('file')
                ->store('business-processes', 'public');
        }

        $businessProcess->update($data);

        return back();
    }

    public function destroy(BusinessProcess $businessProcess)
    {
        // if ($businessProcess->file_path && Storage::disk('public')->exists($businessProcess->file_path))
        //     Storage::disk('public')->delete($businessProcess->file_path);
        $businessProcess->delete();
        return back();
    }

    public function storeNode(Request $request){
        $data = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'level' => 'required|in:1,2',
            'parent_id' => 'nullable|exists:business_process_nodes,id',
            'group_owner' => 'required|exists:group_owners,id'
        ]);

        BusinessProcessNode::create($data);
        return back();
    }

    public function updateNode(Request $request, BusinessProcessNode $node)
    {
        $data = $request->validate([
            'name' => 'required',
            'code' => 'required',
            'parent_id' => 'nullable|exists:business_process_nodes,id'
        ]);

        // if(!isset($data['parent_id'])){
        //     $data['parent_id'] = null;
        //     $data['level'] = 1;
        // }

        $node->update($data);
        return back();
    }

    public function destroyNode(BusinessProcessNode $node)
    {
        $node->delete();
        return back();
    }
}
