<?php

namespace App\Http\Controllers;

use App\Models\BusinessProcess;
use App\Models\BusinessProcessNode;
use App\Models\GroupOwner;
use Illuminate\Http\Request;
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
            ->orderBy('order')
            ->get()
            ->map(fn($node) => [
                'id' => $node->id,
                'code' => $node->code,
                'name' => $node->name,
                'level' => $node->level,
                'children' => $node->children
                    ->filter(fn($child) => $child->processes->isNotEmpty())
                    ->map(fn($child) => [
                        'id' => $child->id,
                        'code' => $child->code,
                        'name' => $child->name,
                        'level' => $child->level,
                        'processes' => $child->processes->map(fn($process) => [
                            'id' => $process->id,
                            'name' => $process->name,
                            'file_path' => 'storage/'.$process->file_path,
                        ]),
                    ]),
            ]);

        return Inertia::render('business-process/index', [
            'query' => $query,
            'nodes' => $nodes,
        ]);
    }

    public function store(Request $request)
    {

    }


    public function update(Request $request, BusinessProcess $businessProcess)
    {

    }

    public function destroy(BusinessProcess $businessProcess)
    {

    }
}
