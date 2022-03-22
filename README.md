# sforb11_MakeP5Sing

CSC 2463 Project, adding sounds to previously uploaded Bug Squish project!

GitHub Link: https://github.com/sforb11/sforb11_MakeP5Sing

Here are the instances/descriptions where the assignment specifications were implemented:

---------------------------------------

"Make a fun musical theme with your new found sequence, scheduling and looping skills."

    1. Developed music for start screen, during gameplay, and on game over screen using different synthesizers, loops, patterns, and other audio/Tone techniques.

    NOTE: I noticed a bug that sometimes occurs when refreshing the page, and the start screen music will never
    play. I don't know why this happens, because it triggers as soon as the draw function starts. I'm pretty sure it is an issue with my browser rather than my code, but I am working to fix it. It usually works just as intended though.

---------------------------------------

"Have in-game events trigger sonic events. These could be synthesized, soundfiles, or both. What is the sound of a squished bug? A missed bug? Frenzied bug skittering?"

I identified the first two examples with soundfiles:
    Squished bug triggers:
        images/Squished.wav
    Missed bug triggers:
        images/Miss.wav

---------------------------------------

"As the game play changes, (increases speed, adds more bugs, nears the end) represent it sonically. How will the music or sound adapt?"

    1. As the bugs increase speed with each squish, the bpm of the background playing music increases.

    2. As the gameplay nears the end, a timer sound starts to play around the last 5 seconds of the game. This sound can be found under images/Time.wav

---------------------------------------

"Incorporate game states into the sound design. e.g. start page, game over, etc. Adapt your music or interaction sounds accordingly."

    1. the music pattern/synth changes depending on the gamestate, and there are trigger sounds such as images/Spawn.wav that indicate certain switches in gamestates.

All sound files were downloaded from freesound.org!