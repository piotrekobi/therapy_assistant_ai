import random
import linecache
import nltk
from nltk.corpus import cmudict
import pyphen

vowels = {"a", "e", "i", "o", "u", "y", "ą", "ę", "ó"}

pl_prepositions = {
    "w", "na", "pod", "przy", "nad", "po", "za", "do", "przed", "z", "ze",
    "bez", "u", "o", "i", "bo", "nie", "a", "że", "dla", "są", "to", "przez",
    "jest", "kim", "co", "ma", "gdy", "jak", "od", "mój", "czy", "tak", "iż",
    "kto", "by", "im", "aż", "lub", "ja", "się", "był", "niż", "mam"
}

pl_pronouns = {
    "ja", "ty", "on", "to", "my", "wy", "one", "go", "ją", "je", "nas", "was",
    "ich", "mnie", "nim", "nią", "nas", "was", "się", "sie", "ci", "być", "nam", "cię"
}

en_prepositions = {
    "each", "in", "on", "we", "through", "across", "beside", "near", "at",
    "with", "of", "to", "from", "by", "for", "as", "he", "up", "i", "you",
    "he", "she", "they", "her", "his", "is", "the", "it", "and", "an", "when",
    "will", "but", "a", "be"
}

en_pronouns = {"it", "me", "him", "us", "them"}

punctuation = {",", ".", "?", "!", ":", ";", '-'}

gloski = ["A", "O", "E", "U", "I", "Y"]

intonations = [
    "z radością", "ze smutkiem", "ze śmiechem", "z płaczem", "ze złością",
    "z zadowoleniem", "z zazdrością", "z pretensją", "z zachwytem",
    "ze strachem", "ze zdziwieniem", "z pogardą", "ze zmęczeniem",
    "z litością", "z niedowierzaniem", "z ciekawością", "z konspiracją",
    "z miłością", "z nienawiścią", "z ironią", "z wyrzutem", "uwodzicielsko",
    "umierająco", "z uczuciem zimna", "z uczuciem gorąca"
]

PL_WORD_COUNTS = [("1.txt", 3487), ("2.txt", 20533), ("3.txt", 31738),
                  ("4.txt", 22823), ("5.txt", 9721), ("6.txt", 3251),
                  ("more.txt", 1160)]

EN_WORD_COUNTS = [("1.txt", 4288), ("2.txt", 12644), ("3.txt", 12137),
                  ("4.txt", 8059), ("5.txt", 3172), ("6.txt", 933),
                  ("more.txt", 195)]

tempos = {1: 2, 2: 4, 3: 6, 4: 8, 5: 6, 6: 10}

with open('files/polish/words.txt', 'r', encoding='utf-8') as f:
    pl_words = [line.strip() for line in f.readlines()]

with open('files/english/words.txt', 'r', encoding='utf-8') as f:
    en_words = [line.strip() for line in f.readlines()]

nltk.download('cmudict')
pronouncing_dict = cmudict.dict()
pyphen_dict = pyphen.Pyphen(lang='en')


def en_syllable_count(word):
    word = word.lower()

    if word in pronouncing_dict:
        return max([
            len(list(y for y in x if y[-1].isdigit()))
            for x in pronouncing_dict[word]
        ])
    else:
        return len(pyphen_dict.inserted(word).split('-'))


def pl_syllable_count(word):
    num_syllables = 0
    for i in range(0, len(word)):
        letter = word[i].lower()
        if letter in vowels:
            if i < len(word) - 1:
                next_letter = word[i + 1].lower()
                if next_letter == letter:
                    continue
                if letter == "i":
                    if next_letter in vowels:
                        continue
            if i > 0:
                prev_letter = word[i - 1].lower()
                if letter == "u":
                    if prev_letter in vowels and prev_letter != "i":
                        continue
            num_syllables += 1
    return num_syllables


def remove_punctuation(word):
    return ''.join(char for char in word if char not in punctuation)


def divide_sentence(sentence, tempo, lang="pl"):

    if lang == "pl":
        syllable_count = pl_syllable_count
        prepositions = pl_prepositions
        pronouns = pl_pronouns
    else:
        syllable_count = en_syllable_count
        prepositions = en_prepositions
        pronouns = en_pronouns

    sentence = sentence.replace("\n", " \n")
    words = sentence.split(" ")
    words_with_rules = []

    i = 0
    words_stack = []
    current_syllables = 0
    try:
        while i < len(words):
            if words[i].strip() in punctuation:
                words_stack.append(words[i])
                i += 1
            while words[i].lower() in prepositions:
                words_stack.append(words[i])
                current_syllables += syllable_count(words[i])
                i += 1

            if current_syllables <= 1 or (
                    current_syllables + syllable_count(words[i]) <=
                    tempos[tempo] + 1 and words[i] not in pronouns):
                words_stack.append(words[i])
                current_syllables += syllable_count(words[i])
                i += 1

            if words[i - 1][-1] not in punctuation and remove_punctuation(
                    words[i].lower()) in pronouns:
                if words[i][
                        -1] in punctuation or current_syllables + syllable_count(
                            words[i]) <= tempos[tempo] + 2:
                    words_stack.append(words[i])
                    i += 1
            words_with_rules.append(" ".join(words_stack))
            words_stack.clear()
            current_syllables = 0
    except IndexError:
        words_with_rules.append(" ".join(words_stack))

    result = []
    current_segment = ""
    current_syllables = 0

    for i, word in enumerate(words_with_rules):
        syllables = syllable_count(word)
        segment_with_punctuation = False
        if current_segment != "":
            segment_with_punctuation = current_segment.strip(
            )[-1] in punctuation and len(current_segment.strip()) > 1
        if syllables > 0 and (current_syllables + syllables > tempos[tempo]
                              or segment_with_punctuation):
            if current_segment:
                result.append(current_segment)
            current_segment = word
            current_syllables = syllables
        else:
            if current_segment:
                current_segment += " "
            current_segment += word
            current_syllables += syllables

    if current_segment:
        result.append(current_segment.strip())

    return " | ".join(result)


def generate_vowels():
    chosen_intonations = random.sample(intonations, len(gloski))
    random.shuffle(gloski)
    text = ""
    for vowel, intonation in zip(gloski, chosen_intonations):
        text += f"{vowel}  -  {intonation}\n"
    return text[:-1]


def generate_words(lang="pl"):
    if lang == "en":
        WORD_COUNTS = EN_WORD_COUNTS
        folder = "english"
    else:
        WORD_COUNTS = PL_WORD_COUNTS
        folder = "polish"

    chosen_indices = [
        random.randint(1, words_num) for _file_name, words_num in WORD_COUNTS
    ]

    words = [
        linecache.getline(f"files/{folder}/{file_name}",
                          chosen_indices[i]).strip()
        for i, (file_name, _) in enumerate(WORD_COUNTS)
    ]

    chosen_intonations = random.sample(intonations, len(words))
    text = ""
    for (word, intonation) in zip(words, chosen_intonations):
        text += f"{word} - {intonation}\n"

    return text[:-1]


def random_word_with_chars(characters,
                           starts_with=False,
                           ends_with=False,
                           lang="pl"):

    words = pl_words if lang == "pl" else en_words

    matching_words = []
    characters = characters.lower()
    for word in words:
        lowercase_word = word.lower()
        if characters in lowercase_word:
            if (not starts_with or lowercase_word.startswith(characters)) and (
                    not ends_with or lowercase_word.endswith(characters)):
                matching_words.append(word)

    if not matching_words:
        return None

    word = random.choice(matching_words)

    return word
