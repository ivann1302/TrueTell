<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadAudit;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

final class WorkspaceController extends Controller
{
    public function index(Request $r): View
    {
        $input = $r->validate(['status' => ['nullable', Rule::in(['new', 'processed'])], 'search' => ['nullable', 'string', 'max:254'], 'lead' => ['nullable', 'uuid']]);
        $status = $input['status'] ?? '';
        $search = trim($input['search'] ?? '');
        $query = Lead::query()->when($status, fn (Builder $q) => $q->where('status', $status));
        if ($search !== '') {
            $query->where(function (Builder $q) use ($search): void {
                $hash = Lead::searchHash($search);
                $q->where('name_hash', $hash)->orWhere('contact_hash', $hash)
                    ->orWhere('source', 'like', '%'.addcslashes($search, '%_\\').'%')
                    ->orWhere('id', 'like', '%'.addcslashes(strtolower($search), '%_\\'));
            });
        }

        return view('workspace.index', [
            'leads' => $query->latest()->paginate(20)->withQueryString(),
            'selected' => isset($input['lead']) ? Lead::with('audits.user')->findOrFail($input['lead']) : null,
            'counts' => ['all' => Lead::count(), 'new' => Lead::where('status', 'new')->count(), 'processed' => Lead::where('status', 'processed')->count()],
            'status' => $status, 'search' => $search,
        ]);
    }

    public function status(Request $r, Lead $lead): RedirectResponse
    {
        $data = $r->validate(['status' => ['required', Rule::in(['new', 'processed'])]]);
        DB::transaction(function () use ($r, $lead, $data): void {
            $locked = Lead::lockForUpdate()->findOrFail($lead->id);
            if ($locked->status !== $data['status']) {
                $locked->update(['status' => $data['status']]);
                LeadAudit::create(['lead_id' => $locked->id, 'user_id' => $r->user()?->id, 'status' => $data['status']]);
            }
        });

        return redirect()->route('workspace.index', ['lead' => $lead->id])->with('status', 'Статус обновлён.');
    }
}
