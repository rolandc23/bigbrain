Our application revolves around a simple and logical approach in design in the attempt to improve 
user experience and user interface, making it easy to navigate through all of 'big brain's' functionalities. 
We have also conducted user research in a back-and-forth process, responding to feedback and making changes 
accordingly.

User Experience:

Our application design is kept straightforward and simple as we aimed to avoid all possible situations which might 
overcomplicate the user's experience and in turn reduce the usability of the app. All intended behaviours of 
buttons/inputs and other components are wrapped with short labels, and any error which occurs are clearly 
explained with steps on how to avoid them in future. Areas to improve however are the interactions between 
player and admin when a quiz is live, where there is still a noticeable delay between API fetch calls and timers, 
thereby making it a bit "clunky" for the user which would thus hinder their overall experience, as per the results 
of our user research.

Outside of that, our test users have commented that navigating throughout the application's components feels smooth 
and akin to that of the real 'kahoot'.

User Interface:

To improve user interface, we have considered various design principles such as alignment, fonts and colors. In terms of 
alignment, most of our basic components are simply aligned vertically along the middle of the display window, but we 
applied grid-designs to our quiz list on the dashboard and question list on edit quiz page. This consideration was made 
with the idea of user efficiency, making it easier for the user in avoiding unnecessary scrolling to find their intended 
quiz/question to enact on. Fonts have been kept consistent around the Arial-font family and font sizes are also relatively 
consistent within elements and components. Colors of our application are mainly based on a blue/light-blue theme in keeping 
it simple, aesthetic and minimalistic and making various components harmonious with one another on the visual appeal.

In terms of visual hierarchy, we have mainly implemented this through size, spacing, alignment and repetition. As previously 
explained, we have put each quiz on the dashboard on the same level as each other through grid-alignment and repetition. We have 
prioritised headers of each page through size, whilst buttons and other interactive elements are also noticeably larger than 
text in making them seem more significant than non-interactive elements. Outlining and spacing between sections are also made 
clear to distinguish parent and child elements

Affordances have also been integrated, of which the majority would be explicit affordances through our choices of 
buttons/input designs acquired from the MUI library. Pattern affordances were also considered with the 'copy link' function 
on the 'start quiz' page, making the text underlined with accomodating text explaining the behaviour of clicking that 
component.

Constraints and user safety are also implemented as much as possible throughout the application in avoiding as much error messages 
being displayed as possible. Examples mainly revolve around disabling buttons when forms are not filled correctly, although the 
limit to this was errors from API calls which cannot be blackboxed within the frontend environment.

In considering the learnability of our application, basic functionality such as filling forms have placeholders labelling what 
should be entered, and when running into an invalid form field, a small error message is displayed (without popup) to describe/
instruct the user on how to fill the form correctly. More sophisticated functions such as our player lobby minigame have clear 
worded instructions on what they should be doing. The behaviour of the points system, along side the rules of playing the quiz are
made clear as well on the player lobby screen.
