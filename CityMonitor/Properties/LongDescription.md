City Monitor provides a compact overview of important city statistics and service conditions directly in the Cities: Skylines II interface.

Instead of repeatedly opening multiple information views, City Monitor can display the most relevant values in one configurable panel or as a compact icon bar. Status colors make it easy to identify potential problems at a glance, while tooltips provide additional details.

## Monitored statistics


- Unemployment rate and number of unemployed citizens
- Homelessness rate and number of homeless citizens
- Open jobs and total job capacity
- Elementary school capacity
- High school capacity
- College capacity
- University capacity
- Fire hazard
- Healthcare availability
- Cemetery availability
- Crematorium availability
- Garbage processing
- Landfill availability
- Crime probability
- Jail availability and crimes per month
- Traffic flow
- Electricity availability
- Water and sewage availability
- Car parking availability
- Bicycle parking availability
- Post service
- Tourism
- City attractiveness

## Compact icon mode

The compact icon mode displays the monitored values as a configurable status bar without the normal panel background.

Features include:

- Horizontal or vertical layout
- Movable icon bar with a dedicated drag handle
- Optional position lock
- Adjustable icon size, spacing and transparency
- Custom icon order
- Individual icons can be hidden
- Hover tooltips with detailed values
- Colored status rings for quick visual feedback

When icon editing is enabled, icons can be reordered by dragging them. Right-clicking an icon hides or restores it.

## Direct information view access

When icon editing is disabled, clicking a status icon opens the corresponding Cities: Skylines II information view.
Clicking the same icon again closes the information view.

Examples include:

- Population
- Education
- Fire & Rescue
- Healthcare & Deathcare
- Garbage Management
- Police
- Traffic
- Electricity
- Water & Sewage
- Roads
- Bicycles
- Post
- Tourism

## Display options

City Monitor can be configured in the game options.

Available settings include:

- Compact values
- Show labels
- Compact icon mode
- Horizontal or vertical icon orientation
- Lock or unlock the icon bar position
- Edit icon visibility and order
- Icon transparency
- Icon size
- Icon spacing
- Color Thresholds can be customized

## Update interval

The update interval for locally calculated employment and education statistics can be configured between 0.5 and 60 seconds.
Many city service indicators use the game's UI bindings directly and therefore update independently of this interval.

## Performance

In compact icon mode, hidden locally calculated indicators are skipped where possible. Service indicators are subscribed only when their corresponding icons are active.


## Credits and inspiration

City Monitor was inspired by City Stats by kendallroth:

https://github.com/kendallroth/cs2-city-stats

City Stats provided the original inspiration for displaying important city statistics in a compact and accessible interface.
With City Stats not receiving further updates since June 2026, I decided to create City Monitor as my own independently developed implementation, expanding the original concept with additional statistics, city service monitoring, customizable status icons, direct information-view access and further display options.
Special thanks to kendallroth for the original City Stats mod and for the inspiration behind this project.

City Monitor is an independent project and is not officially affiliated with City Stats or its developer.

## Transparency note

- Some parts of the code were developed with AI assistance.
- Parts of the UI implementation, debugging and troubleshooting were also created with AI assistance.

## Feedback and bug reports

When reporting a problem, please include:

- A description of the issue
- The City Monitor display mode being used
- The affected status icon or statistic
- Your configured update interval