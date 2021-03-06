/**
 * Created by ray7551@gmail.com on 12.14 014.
 */
import {deepValue, regex} from '../../common/base';

// Punctuations, excluding spaces
// https://en.wikipedia.org/wiki/Punctuation_of_English
const PUNCT = {
  // punctuations
  apostrophe: ['’', '\''],
  brackets: ['[', ']', '(', ')', '{', '}', '⟨', '⟩', '（', '）', '【', '】'],
  colon: [':', '：'],
  comma: [',', '،', '、', '，'],
  dash: ['-', '‐', '‒', '–', '—', '―'],
  ellipsis: ['…', '...'],
  exclamation: ['!', '！'],
  period: ['.', '。'],
  guillemets: {
    left: ['‹', '«', '《', '〈', '『'],
    right: ['›', '»', '》', '〉', '』']
  },
  question: ['?', '？'],
  quotation: ['‘', '’', '“', '”', '\'', '\'', '"', '「', '」'],
  semicolon: [';', '；'],
  slash: ['/', '⁄', '\\'],
  math: ['`', '+', '=', '<', '>', '°'],
  // word dividers
  interpunct: ['·', '・', '･'],
  block: ['¶', '§'],

  // typography
  verticalBar: ['|', '¦', '‖', '∣'],
  tilde: ['~', '˜', '∼'],
  at: ['@'],
  hash: ['#'],
  currency: ['¤', '￥', '$', '€', '£'],// "₳", "฿", "₵", "¢", "₡", "₢", "₫", "₯", "֏", "₠", "ƒ", "₣", "₲", "₴", "₭", "₺", "ℳ", "₥", "₦", "₧", "₱", "₰", "៛", "₽", "₹", "₨", "₪", "৳", "₸", "₮", "₩"],
  per: ['%', '‰', '‱'],
  caret: ['^', '‸'],
  ampersand: ['&'],
  asterisk: ['*'],
  underscore: ['_'],
  ip: ['©', '℗', '®', '℠', '™']
};
const SPACES = [' ', ' ', ' ', '	'];

let PUNCT_FLATTEN = deepValue(PUNCT);
/**
 * keyword blacklist
 * @notice all in lower case
 * @see https://en.wikibooks.org/wiki/English_in_Use/Prepositions,_Conjunctions,_and_Interjections
 */
const KEYWORD_BLACKLIST = [
  ...PUNCT_FLATTEN,
  'i', 'me', 'you', 'he', 'she', 'they', 'it', 'one', 'there', 'that', 'this', 'other',
  'some', 'someone', 'something', 'any', 'anybody', 'anything',
  'my', 'your', 'his', 'her', 'there', 'own',
  'the', 'a', 'my', 'more', 'much', 'either',
  'while', 'meanwhile',
  'be', 'is', 'isn\'t', 'isnt', 'am', 'ain\'t', 'aint', 'are', 'have', 'has', 'get', 'gets', 'got', 'was', 'wasnt',
  'no', 'not',
  'what', 'when', 'who', 'how', 'why', 'whereas', 'whether',
  'very', 'so', 'most', 'least', 'all', 'only', 'just', 'but',
  'do', 'doing', 'did', 'does', 'can', 'cannot', 'can\'t', 'up',
  'should', 'would',
  // https://en.wikipedia.org/wiki/List_of_English_prepositions
  'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'at', 'by', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'during', 'except', 'for', 'from', 'in', 'into', 'of', 'off', 'on', 'over', 'past', 'through', 'to', 'toward', 'towards', 'under', 'underneath', 'until', 'with', 'without',
  // Conjunctions
  'and', 'as', 'both', 'because', 'even', 'for', 'if', 'that', 'then', 'since', 'seeing', 'so', 'or', 'nor', 'either', 'neither', 'than', 'though', 'although', 'yet', 'but', 'except', 'lest', 'unless'
];

/**
 * @see http://www.unicode.org/reports/tr38/#BlockListing
 * #Katakana 30A0–30FF
 * #Hiragana 3040–309F
 * Hangul Jamo  1100–11FF
 * #CJK Unified Ideographs 4E00–9FD5
 * #Hangul Syllables AC00–D7AF
 * CJK Unified Ideographs Extension A 3400–4DB5
 * #: most frequently used
 */
const CJK = regex`\u30A0-\u30FF\u3040-\u309F\u1100-\u11FF\u4E00-\u9FD5`;

// CJK punct excluding guillemets
const CJK_PUNCT = '，。？！·‘’“”；：【】…（）—';

// printable ASCII excluding spaces
const PRINTABLE_ASCII = regex`\u0021-\u007E`;
// printable latin letters, punctuations, symbols, but excluding spaces
// https://en.wikipedia.org/wiki/Latin_script_in_Unicode
const PRINTABLE_EXTEND = regex`\u0021-\u007E\u00A1–\u02FF\u1D00–\u1DBF\u1E00–\u1EFF\u2070–\u218F\u2C60–\u2C7F\uA720–\uA7FF\uAB30–\uAB6F\uFF00–\uFFEF`;

// const CONFIDENCE = 1;
const CONFIDENCE_PARAM = {
  map: {base: 1, site: .1, vip: .49, originVip: 1.5}, // for initialize candidateWords map
  match: {title: 1, meta: 1, h1: 1, h2: .1, pathName: 1, queryPairs: .1}, // for _matchKeyword()
  keyword: {title: .35, h1: .4, h2: .05, pathName: .2, queryPairs: .1}, // for divided keywords
  searchString: 1, // must greater than CONFIDENCE_MIN
  selection: 1 // must greater than CONFIDENCE_MIN
};
const CONFIDENCE_MIN = .99;
const EMPTY_KEYWORDS = [{
  word: '',
  confidence: 0
}];
export {PUNCT, SPACES, PUNCT_FLATTEN, CJK, CJK_PUNCT, PRINTABLE_ASCII, PRINTABLE_EXTEND,
  KEYWORD_BLACKLIST, CONFIDENCE_PARAM, CONFIDENCE_MIN, EMPTY_KEYWORDS
};