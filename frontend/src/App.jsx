import React, { useState } from "react";

import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EnterNameSnackbar from "./EnterNameSnackbar";
import EventList from "./EventList";
import GuidedRecorder from "./GuidedRecorder";
import SessionInfoForm from "./SessionInfoForm";
import { newSession } from "./Bridge";
import { format } from "./Utilities";
import SelfDirectedRecorder from "./SelfDirectedRecorder";
import InTheAirRecorder from "./InTheAirRecorder";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing() * 4
  },
  svg: {
    width: 300,
    height: 300,
  },
}));

function App() {
  const [recording, setRecording] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const classes = useStyles();

  const click = () => {
    if (!recording) {
      if (name === "") setSnackbarOpen(true);
      else {
        setSnackbarOpen(false);
        setEvents([]);
        newSession({ name, notes, mode }, () => setRecording(true));
      }
    } else setRecording(false);
  };

  const onPrompt = ({ newPrompt, datetime, timestamp }) => {
    setEvents(events => [
      [
        format(
          'Prompted "{0}" key with {1} {2}',
          newPrompt.key,
          newPrompt.hand,
          newPrompt.finger
        ),
        datetime + format(" ({0})", timestamp)
      ],
      ...events
    ]);
  };

  const onKey = ({ key, datetime, timestamp }) => {
    setEvents(events => [
      [
        format('"{0}" key pressed', key),
        datetime + format(" ({0})", timestamp)
      ],
      ...events
    ]);
  };

  return (
    <div className={classes.root}>
      <EnterNameSnackbar
        open={snackbarOpen}
        onClose={(_, reason) =>
          reason === "clickaway" || setSnackbarOpen(false)
        }
      />

      <Container maxWidth="lg">
        <br />
        <Typography variant="h2">
          NeuroTech 2020 - Recording Dashboard
        </Typography>
        <br />
        <SessionInfoForm
          {...{ click, recording, name, setName, notes, setNotes, mode, setMode }}
        />
        <br />
        {/* 
        <Fade in={recording}>
          <Paper elevation={5} className={classes.paper}>
            <svg width="1000" height="300" viewBox="0 0 1000 700" >
<g transform="translate(0.000000,853.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M3769 7782 c-70 -36 -110 -94 -132 -193 -16 -73 -36 -207 -78 -504
-11 -82 -39 -226 -61 -320 -131 -555 -132 -558 -148 -868 -15 -297 -40 -391
-125 -466 -66 -58 -130 -32 -184 76 -21 43 -114 357 -126 428 -3 22 -42 117
-85 210 -132 285 -148 334 -186 545 -31 173 -87 414 -109 467 -60 143 -249
179 -363 70 -112 -107 -106 -230 41 -737 43 -150 79 -311 112 -510 27 -161 63
-286 141 -489 119 -311 121 -370 15 -420 -47 -22 -70 -26 -136 -25 -116 1
-183 34 -544 271 -159 105 -190 130 -365 301 -219 214 -280 255 -373 255 -147
0 -224 -164 -150 -315 38 -78 167 -220 333 -367 77 -68 182 -167 234 -220 52
-54 151 -143 220 -198 200 -161 339 -314 340 -373 1 -14 8 -43 16 -65 36 -96
102 -346 108 -410 12 -124 79 -472 126 -650 35 -134 104 -306 175 -440 29 -56
67 -137 84 -180 17 -44 51 -116 77 -160 72 -126 104 -204 120 -290 25 -131 15
-408 -21 -625 -14 -85 -45 -359 -65 -585 -21 -236 -30 -504 -23 -747 l6 -248
900 0 c852 0 899 1 892 18 -3 9 -8 59 -10 110 -3 51 -6 96 -9 100 -3 6 -11 68
-23 177 -2 22 -8 96 -13 165 -5 69 -14 154 -20 190 -10 67 -41 415 -40 460 0
14 -8 99 -18 190 -10 91 -19 252 -20 360 -3 218 -4 243 -34 492 -11 97 -18
188 -14 202 13 54 413 495 598 660 108 96 179 183 254 311 47 79 85 126 179
221 66 67 139 131 163 143 24 12 45 28 48 36 3 8 16 17 27 21 12 3 45 23 72
44 28 21 100 65 160 98 88 48 135 67 233 91 158 39 187 53 218 107 43 73 34
150 -27 219 -44 50 -106 79 -224 105 -209 46 -425 35 -609 -31 -95 -35 -249
-125 -332 -195 -97 -83 -153 -120 -257 -170 -87 -42 -100 -46 -121 -34 -34 17
-42 42 -55 155 -28 245 -24 359 19 555 10 47 24 130 31 185 12 100 31 175 108
422 55 175 106 317 135 378 30 61 85 241 121 390 33 142 73 253 140 390 85
174 164 461 151 553 -8 59 -51 136 -95 169 -70 54 -176 59 -242 12 -80 -56
-198 -271 -280 -504 -42 -123 -79 -202 -154 -335 -23 -41 -123 -232 -220 -425
-193 -378 -247 -469 -322 -535 l-48 -42 -3 36 c-2 20 6 103 17 184 12 81 24
183 27 227 3 44 10 94 15 110 19 63 48 348 54 530 8 253 20 365 55 515 31 134
56 369 52 488 -3 89 -29 149 -84 197 -81 69 -181 83 -269 37z"/>
<path d="M8695 7487 c-59 -23 -93 -47 -132 -91 -57 -64 -77 -134 -70 -244 7
-115 40 -355 71 -517 30 -155 51 -338 66 -570 8 -125 23 -228 56 -395 113
-570 139 -740 115 -740 -25 0 -109 51 -138 83 -55 63 -110 179 -248 527 -76
190 -162 399 -192 465 -87 189 -119 280 -148 420 -51 244 -140 470 -214 544
-62 62 -171 77 -252 36 -85 -45 -142 -125 -159 -227 -20 -112 22 -378 94 -608
32 -100 91 -370 101 -455 11 -100 64 -288 135 -475 18 -47 72 -203 121 -347
73 -218 92 -290 114 -420 14 -87 35 -192 45 -235 37 -142 21 -296 -52 -523
-39 -122 -60 -165 -79 -165 -21 0 -211 197 -289 300 -92 121 -282 315 -362
369 -145 97 -314 151 -569 182 -94 11 -115 10 -174 -4 -37 -9 -83 -27 -102
-38 -50 -31 -93 -103 -93 -154 0 -82 13 -100 135 -180 113 -75 190 -147 375
-350 39 -44 85 -87 101 -95 16 -8 31 -22 34 -31 3 -8 35 -46 71 -85 67 -71
181 -224 227 -304 14 -25 49 -99 77 -165 99 -229 144 -301 251 -399 171 -157
448 -429 558 -546 69 -74 157 -162 196 -195 178 -153 213 -215 271 -480 24
-108 27 -147 31 -390 5 -252 -9 -814 -24 -933 l-6 -52 943 0 942 0 -6 48 c-34
281 -50 400 -71 532 -45 285 -55 390 -55 558 0 192 10 259 79 547 27 110 58
238 69 285 11 47 67 200 125 340 58 140 114 293 126 340 26 107 66 382 81 565
21 263 50 510 71 605 11 52 22 111 25 130 16 104 136 373 244 550 121 196 154
256 191 347 46 114 85 184 178 326 84 127 98 153 152 288 78 195 87 269 43
358 -34 67 -86 103 -158 109 -73 6 -116 -11 -180 -69 -79 -72 -167 -208 -256
-394 -115 -240 -182 -334 -432 -611 -172 -191 -194 -208 -277 -211 -55 -2 -75
2 -121 25 -55 27 -55 27 -73 97 -23 88 -18 226 20 494 22 159 27 242 33 566 5
242 14 418 23 485 21 142 26 550 9 607 -18 61 -69 122 -132 157 -46 26 -65 30
-125 31 -60 0 -78 -4 -125 -31 -70 -39 -115 -98 -130 -167 -6 -30 -13 -200
-15 -388 -5 -399 -6 -409 -103 -839 -52 -229 -60 -280 -76 -501 -11 -144 -19
-197 -34 -233 -12 -25 -25 -46 -29 -46 -4 0 -31 13 -58 29 -62 36 -103 93
-121 168 -14 58 -53 362 -74 566 -14 141 -44 283 -125 602 -49 194 -71 303
-87 430 -11 94 -37 266 -59 383 -51 287 -80 349 -184 398 -55 26 -138 31 -190
11z"/>
</g>
</svg>

          </Paper>
        </Fade> */}

        <br />
        {mode == 0 && <SelfDirectedRecorder {...{ recording, onKey, onPrompt }} />}
        {mode == 1 && <GuidedRecorder {...{ recording, onKey, onPrompt }} />}
        {mode == 2 && <InTheAirRecorder {...{ recording, onPrompt }} />}
        <br />
        <br />
        <EventList {...{ events }} />
      </Container>
    </div>
  );
}

export default App;
