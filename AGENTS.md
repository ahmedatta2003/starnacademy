# Architecture rules
- Public desktop and mobile shortcut menus share `src/data/publicNavigation.ts` so destinations and translations remain consistent.
- Keep Academy Stars as a separate public page composed of the existing student, results, testimonial and download sections with their CMS visibility gates; reuse the existing Footer so partner animation and footer content remain identical across public pages.
- Build new standalone homepage promotions as focused section components, preserving existing section order and CMS visibility controls.
- Present the homepage opening sequence—hero, academy video, then upcoming-course promotion—through one timed carousel that renders only the active slide, preserves CMS visibility controls, and gives the video time to finish.