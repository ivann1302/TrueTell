@extends('workspace.layout')
@section('title', 'Сотрудники')
@section('content')
<header class="page-heading"><h1>Сотрудники</h1><p class="muted">Доступ к заявкам и управление учётными записями.</p></header>
<div class="users-layout">
    <section class="user-list" aria-label="Список сотрудников">
        @foreach($users as $user)
            <article class="user-row"><div><h2>{{ $user->name }} @if($user->id === auth()->id())<span class="hint">(вы)</span>@endif</h2><p>{{ $user->email }}</p><span class="hint">{{ $user->role === 'admin' ? 'Администратор' : 'Сотрудник' }} · {{ $user->active ? 'Доступ открыт' : 'Доступ закрыт' }}</span></div>
                @if($user->id !== auth()->id() && $user->role !== 'admin')<form method="post" action="{{ route('workspace.users.toggle', $user) }}">@csrf<button class="button button-secondary" type="submit" aria-label="{{ $user->active ? 'Закрыть' : 'Открыть' }} доступ: {{ $user->name }}">{{ $user->active ? 'Закрыть доступ' : 'Открыть доступ' }}</button></form>@endif
            </article>
        @endforeach
    </section>
    <section class="user-create" aria-labelledby="create-title"><h2 id="create-title">Добавить сотрудника</h2><p class="muted">Сотрудник сможет просматривать заявки и менять их статус.</p>
        <form class="stack-form" method="post" action="{{ route('workspace.users.store') }}">@csrf
            <label for="name">Имя</label><input id="name" name="name" type="text" autocomplete="name" value="{{ old('name') }}" required maxlength="120">
            <label for="email">Электронная почта</label><input id="email" name="email" type="email" autocomplete="email" value="{{ old('email') }}" required>
            <label for="password">Пароль</label><input id="password" name="password" type="password" autocomplete="new-password" minlength="14" required aria-describedby="password-hint"><span class="hint" id="password-hint">Не менее 14 символов, включая буквы и цифры.</span>
            <label for="password_confirmation">Повторите пароль</label><input id="password_confirmation" name="password_confirmation" type="password" autocomplete="new-password" minlength="14" required>
            <button class="button button-primary" type="submit">Добавить сотрудника</button>
        </form>
    </section>
</div>
@endsection
