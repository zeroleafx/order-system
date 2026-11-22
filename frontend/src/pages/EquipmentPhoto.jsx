import React, { useState } from 'react';

const sampleMedia = new Map([
  ['Canon EOS R6', {
    file: 'Canon_R6_und_RF_85_1%2C2-8068.jpg',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Canon_R6_und_RF_85_1%2C2-8068.jpg/960px-Canon_R6_und_RF_85_1%2C2-8068.jpg',
    author: 'GodeNehler',
    caption: '照片中的鏡頭為搭配示意。',
    description: '採用 Canon RF 接環的全片幅無反相機，適合拍攝人像、活動及日常影像。',
  }],
  ['Canon RF 24-105mm', {
    file: 'Canon_RF24-105mm_F4_L_IS_USM_07_sep_2018.jpg',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Canon_RF24-105mm_F4_L_IS_USM_07_sep_2018.jpg/500px-Canon_RF24-105mm_F4_L_IS_USM_07_sep_2018.jpg',
    author: '昼落ち',
    description: '從廣角到中望遠的標準變焦鏡頭，適合旅行、人物和活動拍攝。使用前可確認相機是否支援 Canon RF 接環。',
  }],
  ['Manfrotto Befree', {
    file: 'Stativ_Manfrotto_Befree_%28Julian_Fischer%29_1.jpg',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Stativ_Manfrotto_Befree_%28Julian_Fischer%29_1.jpg/500px-Stativ_Manfrotto_Befree_%28Julian_Fischer%29_1.jpg',
    author: 'Julian Fischer',
    description: '可折疊的旅行腳架，適合外拍時固定相機，例如拍長曝光照片或合照。',
  }],
  ['Sony A7 IV', {
    src: new URL('./photos/sony-a7-iv.jpg', import.meta.url).href,
  }],
  ['Canon EOS R7', {
    src: new URL('./photos/Canon EOS R7.jpg', import.meta.url).href,
  }],
  ['Sony ZV-E10', {
    src: new URL('./photos/sony-zv-e10.jpg', import.meta.url).href,
  }],
  ['Fujifilm X-T5', {
    src: new URL('./photos/fujifilm-x-t5.jpg', import.meta.url).href,
  }],
  ['Canon RF 50mm F1.8 STM', {
    src: new URL('./photos/canon-rf-50mm.jpg', import.meta.url).href,
  }],
  ['Sony FE 24-70mm F2.8 GM II', {
    src: new URL('./photos/sony-fe-24-70mm.jpg', import.meta.url).href,
  }],
  ['Sigma 18-50mm F2.8 DC DN (Sony E)', {
    src: new URL('./photos/sigma-18-50mm.jpg', import.meta.url).href,
  }],
  ['DJI RS 3 Mini', {
    src: new URL('./photos/dji-rs-3-mini.jpg', import.meta.url).href,
  }],
  ['Godox SL60W', {
    src: new URL('./photos/godox-sl60w.jpg', import.meta.url).href,
  }],
  ['amaran 100d', {
    src: new URL('./photos/amaran-100d.jpg', import.meta.url).href,
  }],
  ['RODE Wireless GO II', {
    src: new URL('./photos/rode-wireless-go-ii.jpg', import.meta.url).href,
  }],
  ['Zoom H5', {
    src: new URL('./photos/zoom-h5.jpg', import.meta.url).href,
  }],
]);

function mediaFor(name) {
  return sampleMedia.get(name.trim().replace(/[–—]/g, '-'));
}

export function equipmentDescription(item) {
  const description = item.description?.trim();
  if (description && description !== 'Demo equipment') return description;
  return mediaFor(item.name)?.description ?? '';
}

export function EquipmentPhoto({ name, showCredit = false }) {
  const photo = mediaFor(name);
  const [failed, setFailed] = useState(false);

  if (!photo || failed) {
    return <div className="equipment-photo equipment-photo-empty">暫無照片</div>;
  }

  return (
    <figure className="equipment-photo">
      <img src={photo.src} alt={showCredit ? name : ''} loading={showCredit ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      {showCredit && (
        <figcaption>
          {photo.caption && <span>{photo.caption} </span>}
          <a href={`https://commons.wikimedia.org/wiki/File:${photo.file}`}>照片：{photo.author}</a>
          {' · '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
        </figcaption>
      )}
    </figure>
  );
}
