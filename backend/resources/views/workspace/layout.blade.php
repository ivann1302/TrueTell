<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="color-scheme" content="light dark">
    <title>@yield('title', 'Рабочий кабинет') — {{ config('crm.brand') }}</title>
    <script src="/workspace.js"></script>
    <link rel="stylesheet" href="/workspace.css">
</head>
<body>
<a class="skip-link" href="#main">К содержимому</a>
<header class="topbar">
    <div class="brand"><span>{{ config('crm.brand') }}</span><span class="brand-caption">Рабочий кабинет</span></div>
    @if(auth()->check() && auth()->user()->active)
        <nav class="main-nav" aria-label="Кабинет">
            <a href="{{ route('workspace.index') }}" @if(request()->routeIs('workspace.index')) aria-current="page" @endif>Заявки</a>
            @if(auth()->user()->role === 'admin')
                <a href="{{ route('workspace.users') }}" @if(request()->routeIs('workspace.users*')) aria-current="page" @endif>Сотрудники</a>
            @endif
        </nav>
    @endif
    <div class="header-actions">
        <button class="button button-quiet theme-toggle" type="button" data-theme-toggle aria-label="Включить тёмную тему" title="Включить тёмную тему" hidden>
            <svg class="theme-moon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" /></svg>
            <svg class="theme-sun" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
        </button>
        @if(auth()->check() && auth()->user()->active)
            <span class="current-user">{{ auth()->user()->name }}</span>
            <form method="post" action="{{ route('workspace.logout') }}">@csrf<button class="button button-quiet icon-button" type="submit" aria-label="Выйти из кабинета" title="Выйти из кабинета"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H4v16h5M10 12h11m-4-4 4 4-4 4" /></svg></button></form>
        @endif
    </div>
</header>
<main id="main" class="workspace" tabindex="-1">
    @if(session('status'))<div class="notice" role="status">{{ session('status') }}</div>@endif
    @if($errors->any())
        <div class="notice notice-error" role="alert"><p>Проверьте введённые данные.</p><ul>@foreach($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul></div>
    @endif
    @yield('content')
</main>
</body>
</html>
