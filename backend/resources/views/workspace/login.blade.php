@extends('workspace.layout')
@section('title', 'Вход')
@section('content')
<section class="auth-panel" aria-labelledby="login-title">
    <h1 id="login-title">Вход в кабинет</h1>
    <p class="muted">Введите рабочую почту и пароль.</p>
    <form class="stack-form" method="post" action="{{ route('workspace.login.store') }}">
        @csrf
        <label for="email">Электронная почта</label>
        <input id="email" name="email" type="email" autocomplete="username" value="{{ old('email') }}" required autofocus>
        <label for="password">Пароль</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>
        <button class="button button-primary" type="submit">Войти</button>
    </form>
</section>
@endsection
