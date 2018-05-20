### WikistatsGraph.js

Hi! This is an experiment to move the graphs of [Wikistats](https://stats.wikimedia.org/v2) outside of the dashboard project and, with it, build a canvas renderer for it. My idea is that this will have the following positive effects:

* The main Wikistats repo, as an open source project, will be easier to implement as a separate dashboarding library for stuff that isn't necessarily Wikimedia Statistics.
* The dashboard view of the Wikistats, as it is right now, shows a minimum of 9 charts, each in SVG, which isn't ideal performance wise. That view would benefit from using Canvas instead.
* Moving the charting library to its own package would allow us for some interesting projects, like embedding Wikistats charts in other projects. My main idea here would be to create a previews API so that charts of both Wikistats and the Wikimedia Pageview Tool can be seen from social media.
