- [Guide](#sec-1)
  - [Interaction](#sec-1-1)
  - [Setup](#sec-1-2)
  - [Parameters](#sec-1-3)
- [Connecting with AR](#sec-2)
  - [Maintain State in Backend](#sec-2-1)
    - [Pros](#sec-2-1-1)
    - [Cons](#sec-2-1-2)
    - [Instructions](#sec-2-1-3)
  - [Maintain State in Frontend](#sec-2-2)
    - [Pros](#sec-2-2-1)
    - [Cons](#sec-2-2-2)
- [Next Steps](#sec-3)

# Guide<a id="sec-1"></a>

## Interaction<a id="sec-1-1"></a>

Keyboard inputs:

-   **"space":** select the most likely word
-   **"backspace":** delete last character if one exists, otherwise last word
-   **"C-c":** exit
-   **"0":** Enter word selection mode. Then select a word by pressing a lower case char associated with the desired index
-   **lower case char:** input finger associated with character

## Setup<a id="sec-1-2"></a>

Environment (assuming python3):

```bash
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
```

Run:

```bash
python backend.py
```

## Parameters<a id="sec-1-3"></a>

There are two configurable variables in backend.py

-   **server<sub>mode</sub>:** Indicates whether or not to emit predictions and data over socketio
-   **finger<sub>mode</sub>:** When true, reads signal data from OpenBCI and converts it to finger numbers. When false, reads keypresses from stdin and converts them to finger numbers.

# Connecting with AR<a id="sec-2"></a>

Two potentially approaches for connecting with AR.

## Maintain State in Backend<a id="sec-2-1"></a>

Maintain the state of the word being built in the backend. Send the frontend instructions for updating the UI accordingly.

Backend state:

-   current finger word
-   finger selection mode

Frontend state:

-   most likely words
-   finger selection mode
-   previously typed words
-   most recently typed character

### Pros<a id="sec-2-1-1"></a>

-   Pipeline changes can be flexible without touching frontend code after implementing networking communication
-   Don't have to port python code to C#.
-   Pipeline functionality is empowered by python

### Cons<a id="sec-2-1-2"></a>

-   More complicated network communication
-   Duplicate the finger selection mode state

### Instructions<a id="sec-2-1-3"></a>

1.  Most Likely Words

    Instruction to update the most likely words in the frontend
    
    ```json
    {
      "message": "most_likely_words",
      "words": ["word1", "word2", ...],
    }
    ```

2.  Enter Word Selection Mode

    Instruction to enter word selection mode in the frontend
    
    ```json
    {
      "message": "enter_word_selection"
    }
    ```

3.  Capture word

    Instruction to capture/select a word.
    
    ```json
    {
      "message": "select_word",
      "word": "word2"
    }
    ```

4.  Delete Word

    Instruction to delete a word backwards
    
    ```json
    {
      "message": "delete_word",
    }
    ```

5.  Exit Typing Mode

    Instruction to leave typing mode
    
    ```json
    {
      "message": "leave_typing_mode"
    }
    ```

6.  Error Message

    Instruction to display error message. Potential errors:
    
    -   could not enter word selection mode
    -   could not select word
    
    ```json
    {
      "message": "error_message",
      "error_code": "could_not_select_word"
    }
    ```

## Maintain State in Frontend<a id="sec-2-2"></a>

Maintain all state in the frontend. Directly transmit fingers to the frontend rather than instructions and let the frontend handle itself.

Backend state:

-   none

Frontend state:

-   current finger word
-   finger selection mode
-   most likely words
-   previously typed words
-   most recently typed character

### Pros<a id="sec-2-2-1"></a>

-   Less complicated network communication
-   Duplicate the finger selection mode state

### Cons<a id="sec-2-2-2"></a>

-   Pipeline improvements have to be made in the frontend
-   Have to port python code to C#
-   Pipeline functionality is limited by C#

# TODO Next Steps<a id="sec-3"></a>

-   [X] Connect to previous section of pipeline i.e. read fingers from prediction
-   [X] Connect to AR i.e. send instructions to frontend
-   [ ] Change word selection mode from 0 indexed to 1 indexed.
-   [ ] Trim dictionary
