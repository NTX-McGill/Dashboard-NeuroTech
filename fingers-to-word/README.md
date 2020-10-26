
# Table of Contents

1.  [Guide](#orga0504fe)
    1.  [Interaction](#org9f15338)
    2.  [Setup](#org6891787)
2.  [Connecting with AR](#orgdbbddaa)
    1.  [Maintain State in Backend](#orgd24a1be)
        1.  [Pros](#orgacaa758)
        2.  [Cons](#org6c34bf7)
        3.  [Instructions](#orge80c208)
    2.  [Maintain State in Frontend](#orgf90e69a)
        1.  [Pros](#org4e2bc92)
        2.  [Cons](#org2e89de9)
3.  [](#org6ce662f)


<a id="orga0504fe"></a>

# Guide


<a id="org9f15338"></a>

## Interaction

Keyboard inputs:

-   **"space":** select the most likely word
-   **"backspace":** delete last character if one exists, otherwise last word
-   **"C-c":** exit
-   **"0":** Enter word selection mode. Then select a word by pressing a lower case char associated with the desired index
-   **lower case char:** input finger associated with character


<a id="org6891787"></a>

## Setup

Environment (assuming python3):

    python -m venv venv
    source venv/bin/activate
    python -m pip install -r requirements.txt

Run:

    python prediction.py


<a id="orgdbbddaa"></a>

# Connecting with AR

Two potentially approaches for connecting with AR.


<a id="orgd24a1be"></a>

## Maintain State in Backend

Maintain the state of the word being built in the backend. Send the frontend instructions for updating the UI accordingly.

Backend state:

-   current finger word
-   finger selection mode

Frontend state:

-   most likely words
-   finger selection mode
-   previously typed words
-   most recently typed character


<a id="orgacaa758"></a>

### Pros

-   Pipeline changes can be flexible without touching frontend code after implementing networking communication
-   Don't have to port python code to C#.
-   Pipeline functionality is empowered by python


<a id="org6c34bf7"></a>

### Cons

-   More complicated network communication
-   Duplicate the finger selection mode state


<a id="orge80c208"></a>

### Instructions

1.  Most Likely Words

    Instruction to update the most likely words in the frontend
    
        {
          "message": "most_likely_words",
          "words": ["word1", "word2", ...],
        }

2.  Enter Word Selection Mode

    Instruction to enter word selection mode in the frontend
    
        {
          "message": "enter_word_selection"
        }

3.  Capture word

    Instruction to capture/select a word.
    
        {
          "message": "select_word",
          "word": "word2"
        }

4.  Delete Word

    Instruction to delete a word backwards
    
        {
          "message": "delete_word",
        }

5.  Exit Typing Mode

    Instruction to leave typing mode
    
        {
          "message": "leave_typing_mode"
        }

6.  Error Message

    Instruction to display error message. Potential errors:
    
    -   could not enter word selection mode
    -   could not select word
    
        {
          "message": "error_message",
          "error_code": "could_not_select_word"
        }


<a id="orgf90e69a"></a>

## Maintain State in Frontend

Maintain all state in the frontend. Directly transmit fingers to the frontend rather than instructions and let the frontend handle itself.

Backend state:

-   none

Frontend state:

-   current finger word
-   finger selection mode
-   most likely words
-   previously typed words
-   most recently typed character


<a id="org4e2bc92"></a>

### Pros

-   Less complicated network communication
-   Duplicate the finger selection mode state


<a id="org2e89de9"></a>

### Cons

-   Pipeline improvements have to be made in the frontend
-   Have to port python code to C#
-   Pipeline functionality is limited by C#


<a id="org6ce662f"></a>

# TODO 

-   Change word selection mode from 0 indexed to 1 indexed.

