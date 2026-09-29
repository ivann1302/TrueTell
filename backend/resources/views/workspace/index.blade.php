@extends('workspace.layout')
@section('title', 'Заявки')
@section('content')
@php($filters = array_filter(['status' => $status, 'search' => $search], fn ($value) => $value !== ''))
<header class="page-heading"><h1>Заявки</h1><p class="muted">Обращения с сайта и история их обработки.</p></header>
<div class="inbox-toolbar">
    <nav class="filter-tabs" aria-label="Статус заявок">
        @foreach(['' => ['Все', 'all'], 'new' => ['Новые', 'new'], 'processed' => ['Обработанные', 'processed']] as $key => $tab)
            <a href="{{ route('workspace.index', array_filter(['status' => $key, 'search' => $search])) }}" @if($status === $key) aria-current="page" @endif>{{ $tab[0] }} <span>{{ $counts[$tab[1]] }}</span></a>
        @endforeach
    </nav>
    <form class="search-form" method="get" action="{{ route('workspace.index') }}">
        @if($status)<input type="hidden" name="status" value="{{ $status }}">@endif
        <label class="sr-only" for="search">Имя или контакт целиком, источник или номер</label>
        <input id="search" name="search" type="search" value="{{ $search }}" placeholder="Поиск заявок" aria-describedby="search-hint">
        <button class="button button-secondary" type="submit">Найти</button>
        <span id="search-hint" class="hint">Имя или контакт целиком, источник или номер</span>
    </form>
</div>
<div class="inbox {{ $selected ? 'has-selection' : '' }}">
    <section class="lead-list" aria-label="Список заявок">
        <table class="leads-table">
            <thead><tr><th scope="col">Заявка</th><th scope="col">Контакт</th><th scope="col">Статус</th><th scope="col">Дата</th></tr></thead>
            <tbody>
            @forelse($leads as $lead)
                <tr @class(['is-selected' => $selected && $selected->id === $lead->id])>
                    <td><a class="lead-link" href="{{ route('workspace.index', array_merge($filters, ['lead' => $lead->id, 'page' => $leads->currentPage()])) }}" @if($selected && $selected->id === $lead->id) aria-current="true" @endif><strong>{{ $lead->name ?: 'Без имени' }}</strong><span class="hint">№ {{ $lead->reference }}@if($lead->source) · {{ $lead->source }}@endif</span></a></td>
                    <td class="contact-cell">{{ $lead->contact }}</td>
                    <td><span class="status status-{{ $lead->status }}">{{ $lead->status === 'new' ? 'Новая' : 'Обработана' }}</span></td>
                    <td class="date-cell"><time datetime="{{ $lead->created_at->toIso8601String() }}">{{ $lead->created_at->format('d.m.Y') }}<span class="hint">{{ $lead->created_at->format('H:i') }}</span></time></td>
                </tr>
            @empty
                <tr><td colspan="4" class="empty-state">{{ $search || $status ? 'По вашему запросу заявок нет. Попробуйте изменить фильтры.' : 'Заявок пока нет. Новые обращения с сайта появятся здесь.' }}</td></tr>
            @endforelse
            </tbody>
        </table>
        @if($leads->hasPages())
            <nav class="pagination" aria-label="Страницы заявок">
                @if($leads->previousPageUrl())<a class="button button-secondary" href="{{ $leads->previousPageUrl() }}">Назад</a>@endif
                <span class="muted">{{ $leads->currentPage() }} из {{ $leads->lastPage() }}</span>
                @if($leads->nextPageUrl())<a class="button button-secondary" href="{{ $leads->nextPageUrl() }}">Далее</a>@endif
            </nav>
        @endif
    </section>
    <section class="lead-detail" aria-labelledby="detail-title">
        @if($selected)
            <a class="mobile-back" href="{{ route('workspace.index', array_merge($filters, ['page' => $leads->currentPage()])) }}">← К списку заявок</a>
            <div class="detail-heading"><h2 id="detail-title">Заявка № {{ $selected->reference }}</h2><span class="status status-{{ $selected->status }}">{{ $selected->status === 'new' ? 'Новая' : 'Обработана' }}</span></div>
            <dl class="detail-fields">
                <div><dt>Имя</dt><dd>{{ $selected->name ?: 'Не указано' }}</dd></div>
                <div><dt>Контакт · {{ ['phone' => 'Телефон', 'email' => 'Почта', 'telegram' => 'Telegram', 'max' => 'MAX', 'whatsapp' => 'WhatsApp'][$selected->contact_method] ?? $selected->contact_method }}</dt><dd>{{ $selected->contact }}</dd></div>
                <div><dt>Сообщение</dt><dd class="message-text">{{ $selected->message ?: 'Без сообщения' }}</dd></div>
                <div><dt>Получена</dt><dd><time datetime="{{ $selected->created_at->toIso8601String() }}">{{ $selected->created_at->format('d.m.Y в H:i') }}</time></dd></div>
                <div><dt>Источник</dt><dd>{{ $selected->source ?: 'Не указан' }}</dd></div>
                <div><dt>Страница</dt><dd>{{ $selected->page_path ?: 'Не указана' }}</dd></div>
                @if($selected->utm)<div><dt>UTM-метки</dt><dd><dl class="utm-fields">@foreach($selected->utm as $key => $value)<div><dt>{{ $key }}</dt><dd>{{ is_scalar($value) ? $value : '' }}</dd></div>@endforeach</dl></dd></div>@endif
            </dl>
            <form method="post" action="{{ route('workspace.leads.status', $selected) }}">
                @csrf<input type="hidden" name="status" value="{{ $selected->status === 'new' ? 'processed' : 'new' }}">
                <button class="button {{ $selected->status === 'new' ? 'button-primary' : 'button-secondary' }}" type="submit">{{ $selected->status === 'new' ? 'Отметить обработанной' : 'Вернуть в новые' }}</button>
            </form>
            <section class="audit-history" aria-labelledby="history-title"><h3 id="history-title">История обработки</h3>
                <ol>@forelse($selected->audits as $audit)<li><p>{{ $audit->status === 'processed' ? 'Отмечена обработанной' : 'Возвращена в новые' }}</p><span class="hint">{{ $audit->user?->name ?: 'Сотрудник' }} · {{ $audit->created_at->format('d.m.Y H:i') }}</span></li>@empty<li class="muted">Статус ещё не меняли.</li>@endforelse</ol>
            </section>
        @else
            <div class="detail-placeholder"><h2 id="detail-title">Детали заявки</h2><p class="muted">Выберите обращение в списке, чтобы прочитать сообщение и изменить статус.</p></div>
        @endif
    </section>
</div>
@endsection
