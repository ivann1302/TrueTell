<?php

declare(strict_types=1);

return [
    'required' => 'Заполните поле «:attribute».',
    'email' => 'Укажите корректный email.',
    'string' => 'Поле «:attribute» должно содержать текст.',
    'max' => ['string' => 'Поле «:attribute» не должно превышать :max символов.'],
    'min' => ['string' => 'Поле «:attribute» должно содержать не меньше :min символов.'],
    'confirmed' => 'Пароли не совпадают.',
    'unique' => 'Такое значение поля «:attribute» уже используется.',
    'in' => 'Выберите допустимое значение поля «:attribute».',
    'regex' => 'Проверьте формат поля «:attribute».',
    'accepted' => 'Необходимо согласие на обработку данных.',
    'password' => ['letters' => 'Пароль должен содержать буквы.', 'numbers' => 'Пароль должен содержать цифры.'],
    'attributes' => ['name' => 'Имя', 'email' => 'Email', 'password' => 'Пароль', 'contact' => 'Контакт', 'contact_method' => 'Способ связи', 'message' => 'Сообщение', 'code' => 'Код подтверждения'],
];
