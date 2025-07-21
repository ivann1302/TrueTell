#!/bin/bash

BUCKET_NAME="truetell"
BUILD_DIR="./dist"
FOLDER_ID=$(yc config get folder-id)

set -e

echo "🔍 Проверка CLI..."
command -v yc >/dev/null || { echo "❌ yc не найден"; exit 1; }
command -v aws >/dev/null || { echo "❌ aws не найден"; exit 1; }

echo "📦 Проверка бакета..."
if ! yc storage bucket get --name "$BUCKET_NAME" &> /dev/null; then
  yc storage bucket create --name "$BUCKET_NAME"
fi

echo "🌍 Настройка доступа..."
yc resource-manager folder add-access-binding \
  --id "$FOLDER_ID" \
  --role storage.viewer \
  --subject system:allUsers

echo "🧩 Включаю статический хостинг..."
aws s3api put-bucket-website \
  --bucket "$BUCKET_NAME" \
  --website-configuration '{
    "IndexDocument": { "Suffix": "index.html" },
    "ErrorDocument": { "Key": "404.html" }
  }' \
  --endpoint-url https://storage.yandexcloud.net

echo "🧹 Очищаю старые файлы..."
yc storage s3 rm --recursive "s3://$BUCKET_NAME"

echo "📤 Загружаю index.html..."
aws s3 cp "$BUILD_DIR/index.html" "s3://$BUCKET_NAME/index.html" \
  --content-type "text/html" \
  --endpoint-url https://storage.yandexcloud.net

echo "📤 Загружаю .js файлы с правильным Content-Type..."
find "$BUILD_DIR" -type f -name "*.js" | while read -r file; do
  key="${file#$BUILD_DIR/}"
  aws s3 cp "$file" "s3://$BUCKET_NAME/$key" \
    --content-type "application/javascript" \
    --endpoint-url https://storage.yandexcloud.net
done

echo "📤 Загружаю .css файлы с правильным Content-Type..."
find "$BUILD_DIR" -type f -name "*.css" | while read -r file; do
  key="${file#$BUILD_DIR/}"
  aws s3 cp "$file" "s3://$BUCKET_NAME/$key" \
    --content-type "text/css" \
    --endpoint-url https://storage.yandexcloud.net
done

echo "📤 Загружаю остальные файлы..."
aws s3 cp "$BUILD_DIR" "s3://$BUCKET_NAME" \
  --recursive \
  --exclude "*.html" \
  --exclude "*.js" \
  --exclude "*.css" \
  --endpoint-url https://storage.yandexcloud.net

echo "✅ Готово! Проверь сайт:"
echo "🌐 http://$BUCKET_NAME.website.yandexcloud.net"
