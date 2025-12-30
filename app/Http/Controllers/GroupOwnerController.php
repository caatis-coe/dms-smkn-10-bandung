<?php

namespace App\Http\Controllers;

use App\Models\Config;
use App\Models\GroupOwner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupOwnerController extends Controller
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

        $groupOwners = GroupOwner::query()
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
                        $q->where($key, 'LIKE', "%{$value}%");
                    }
                }
            })
            ->paginate($query['per_page'])
            ->withQueryString();

        return Inertia::render('group-owner/index', [
            'groupOwners' => $groupOwners,
            'query' => $query,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:group_owners,name',
        ]);

        GroupOwner::create($validated);

        return back()->with('success', 'Group owner created.');
    }

    public function changeName(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:24',
        ]);

        Config::where('variable', 'group_owner')->first()->update([
            'value' => $validated['name'],
        ]);

        return back()->with('success', 'Group owner name updated to ' . $validated['name'] . '.');
    }

    public function update(Request $request, GroupOwner $groupOwner)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:group_owners,name,' . $groupOwner->id,
        ]);

        $groupOwner->update($validated);

        return back()->with('success', 'Group owner updated.');
    }

    public function destroy(GroupOwner $groupOwner)
    {
        $groupOwner->delete();

        return back()->with('success', 'Group owner deleted.');
    }
}
