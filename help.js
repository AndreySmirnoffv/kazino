import fs from 'fs';
import path from 'path';

const imagesDir = './images';

function listImages() {
  try {
    // Получение всех файлов в директории
    const files = fs.readdirSync(imagesDir);
    
    // Переменная для хранения количества изображений
    let count = 0;

    // Проходим по каждому файлу и выводим его имя
    files.forEach(file => {
      const fileName = path.parse(file).name;
      console.log(fileName);
      count++;
    });

    // Выводим общее количество изображений
    console.log(`Всего изображений: ${count}`);
  } catch (err) {
    console.error('Ошибка:', err);
  }
}

// Вызов функции
listImages();
