const fs = require('fs');
const path = require('path');

// Load từ điển tiếng Việt
const DICTIONARY_PATH = path.join(__dirname, '../../data/vietnamese-words.txt');
let vietnameseDictionary = new Set();
let vietnameseMap = null;

// Load dictionary
function loadDictionary() {
  try {
    if (fs.existsSync(DICTIONARY_PATH)) {
      const content = fs.readFileSync(DICTIONARY_PATH, 'utf-8');
      const words = content.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
      vietnameseDictionary = new Set(words);
      console.log(`📚 [Nối Từ] Đã load ${vietnameseDictionary.size} từ tiếng Việt`);
    }
  } catch (error) {
    console.error('Lỗi load từ điển:', error);
  }
}

// Load dictionary khi khởi động
loadDictionary();

// Map chữ có dấu
function getVietnameseMap() {
  if (vietnameseMap) return vietnameseMap;
  vietnameseMap = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd'
  };
  return vietnameseMap;
}

// Chuẩn hóa chữ cái
function normalizeLetter(char) {
  const map = getVietnameseMap();
  return map[char.toLowerCase()] || char.toLowerCase();
}

// Lấy âm tiết cuối
function getLastSyllable(phrase) {
  const words = phrase.trim().toLowerCase().split(/\s+/);
  return words[words.length - 1];
}

// Lấy âm tiết đầu
function getFirstSyllable(phrase) {
  const words = phrase.trim().toLowerCase().split(/\s+/);
  return words[0];
}

// Regex validate từ
const VALID_WORD_REGEX = /^[a-zA-ZàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ\s]+$/;

// Validate cú pháp từ
function isValidWord(word) {
  return word && word.length >= 2 && VALID_WORD_REGEX.test(word);
}

// Kiểm tra trong từ điển local
function isInLocalDictionary(word) {
  return vietnameseDictionary.has(word.toLowerCase());
}

// Kiểm tra với API (Wiktionary)
async function checkWordWithAPI(word) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://vi.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(word)}&format=json`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);
    const data = await response.json();
    const pages = data.query?.pages;

    if (pages) {
      const pageId = Object.keys(pages)[0];
      return pageId !== '-1';
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Kiểm tra từ có nghĩa
async function isValidMeaningfulWord(word) {
  const normalizedWord = word.trim().toLowerCase();

  // Kiểm tra local trước
  if (isInLocalDictionary(normalizedWord)) {
    return { valid: true, source: 'local' };
  }

  // Fallback API
  const apiResult = await checkWordWithAPI(normalizedWord);
  if (apiResult) {
    vietnameseDictionary.add(normalizedWord);
    return { valid: true, source: 'api' };
  }

  return { valid: false, reason: 'not_in_dictionary' };
}

// Thêm từ vào dictionary
function addWordToDictionary(word) {
  vietnameseDictionary.add(word.trim().toLowerCase());
}

// Lấy số từ trong dictionary
function getDictionarySize() {
  return vietnameseDictionary.size;
}

module.exports = {
  normalizeLetter,
  getLastSyllable,
  getFirstSyllable,
  isValidWord,
  isInLocalDictionary,
  checkWordWithAPI,
  isValidMeaningfulWord,
  addWordToDictionary,
  getDictionarySize,
  loadDictionary
};
