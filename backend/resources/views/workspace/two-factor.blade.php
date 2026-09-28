@extends('workspace.layout')
@section('title', 'Подтверждение входа')
@section('content')
<section class="auth-panel" aria-labelledby="verification-title">
    <h1 id="verification-title">{{ $enrolling ? 'Защитите свой кабинет' : 'Подтверждение входа' }}</h1>
    @if($enrolling && $secret)
        <p class="muted">Добавьте аккаунт в приложение-аутентификатор с помощью ключа ниже. Затем введите шестизначный код из приложения.</p>
        <label for="authenticator-key">Ключ для настройки</label>
        <input class="secret-key" id="authenticator-key" type="text" value="{{ $secret }}" readonly spellcheck="false" autocomplete="off">
        <p class="hint">Сохраните ключ в надёжном месте. Он показывается только при настройке.</p>
    @else
        <p class="muted">Введите шестизначный код из приложения-аутентификатора.</p>
    @endif
    <form class="stack-form" method="post" action="{{ route('workspace.two-factor.store') }}">
        @csrf
        <label for="code">Код подтверждения</label>
        <input id="code" class="code-input" name="code" type="text" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required autofocus>
        <button class="button button-primary" type="submit">Подтвердить</button>
    </form>
    <form class="auth-logout" method="post" action="{{ route('workspace.logout') }}">@csrf<button class="button button-quiet" type="submit">Вернуться ко входу</button></form>
</section>
@endsection
