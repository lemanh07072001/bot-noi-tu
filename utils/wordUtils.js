const fs = require('fs');
const path = require('path');

// Cache từ điển và Vietnamese map
let vietnameseDictionary = new Set();
let dictionaryLoaded = false;

// Vietnamese character map - tạo 1 lần, dùng mãi
const VIETNAMESE_MAP = {
  'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
  'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
  'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
  'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
  'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
  'đ': 'd'
};

// Regex pattern - compile 1 lần
const VALID_WORD_REGEX = /^[a-zàáạảãăằắặẳẵâầấậẩẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-]+$/i;

// API timeout (ms)
const API_TIMEOUT = 5000;

function loadDictionary() {
  if (dictionaryLoaded) return;

  try {
    const dictPath = path.join(__dirname, '..', 'data', 'vietnamese-words.txt');
    const content = fs.readFileSync(dictPath, 'utf-8');
    const words = content.split('\n');

    // Tối ưu: dùng for loop thay vì map + filter
    for (let i = 0; i < words.length; i++) {
      const word = words[i].trim().toLowerCase();
      if (word.length > 0) {
        vietnameseDictionary.add(word);
      }
    }

    dictionaryLoaded = true;
    console.log(`📚 Đã tải ${vietnameseDictionary.size} từ vào từ điển.`);
  } catch (error) {
    console.error('❌ Lỗi khi tải từ điển:', error.message);
  }
}

// Load từ điển khi module được require
loadDictionary();

// Normalize chữ cái tiếng Việt (dùng để so sánh)
function normalizeLetter(char) {
  return VIETNAMESE_MAP[char] || char;
}

// Lấy âm tiết cuối cùng của cụm từ
// Ví dụ: "con cá" -> "cá", "cá kho" -> "kho"
function getLastSyllable(phrase) {
  const words = phrase.trim().toLowerCase().split(/\s+/);
  return words[words.length - 1];
}

// Lấy âm tiết đầu tiên của cụm từ
// Ví dụ: "cá kho" -> "cá", "kho hàng" -> "kho"
function getFirstSyllable(phrase) {
  const words = phrase.trim().toLowerCase().split(/\s+/);
  return words[0];
}

// Kiểm tra từ có hợp lệ không
function isValidWord(word) {
  return word && word.length >= 2 && VALID_WORD_REGEX.test(word);
}

// Kiểm tra từ có trong từ điển cục bộ không
function isInLocalDictionary(word) {
  if (!dictionaryLoaded) loadDictionary();
  return vietnameseDictionary.has(word.trim().toLowerCase());
}

// Kiểm tra từ qua API với timeout
async function checkWordWithAPI(word) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const encodedWord = encodeURIComponent(word.trim().toLowerCase());
    const response = await fetch(
      `https://vi.wiktionary.org/w/api.php?action=query&titles=${encodedWord}&format=json`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { exists: false, error: 'API request failed' };
    }

    const data = await response.json();
    const pages = data.query?.pages;

    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId !== '-1') {
        return { exists: true, source: 'wiktionary' };
      }
    }

    return { exists: false, source: 'wiktionary' };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('API timeout sau', API_TIMEOUT, 'ms');
    } else {
      console.error('Lỗi API:', error.message);
    }
    return { exists: false, error: error.message };
  }
}

// Kiểm tra từ có nghĩa (local + API)
async function isValidMeaningfulWord(word) {
  const normalizedWord = word.trim().toLowerCase();

  if (!isValidWord(normalizedWord)) {
    return { valid: false, reason: 'invalid_format' };
  }

  if (isInLocalDictionary(normalizedWord)) {
    return { valid: true, source: 'local_dictionary' };
  }

  const apiResult = await checkWordWithAPI(normalizedWord);
  if (apiResult.exists) {
    vietnameseDictionary.add(normalizedWord); // Cache kết quả
    return { valid: true, source: 'api_wiktionary' };
  }

  return { valid: false, reason: 'not_in_dictionary' };
}

function getDictionarySize() {
  return vietnameseDictionary.size;
}

function addWordToDictionary(word) {
  vietnameseDictionary.add(word.trim().toLowerCase());
}

module.exports = {
  normalizeLetter,
  getLastSyllable,
  getFirstSyllable,
  isValidWord,
  isInLocalDictionary,
  checkWordWithAPI,
  isValidMeaningfulWord,
  getDictionarySize,
  addWordToDictionary,
  loadDictionary
};
