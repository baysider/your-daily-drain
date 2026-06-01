Daily Drain -- Project Brief

What it is:

A free web tool that shows people how much their daily energy drink habit is actually costing them, offers cheaper alternatives to the same habit (not quitting), and shows what they could do with the money saved.

Core mechanic:

User inputs three things: their current drink brand, how many per day, and their hourly wage. The calculator outputs annual cost, weekly cost, and most importantly how many hours per year they work just to support that habit. It then shows cheaper alternatives with the savings delta, and translates those savings into real things: experiences, gear, travel.

The angle that separates it:

Not a quitting tool. Not a guilt trip. The message is "drink cheaper, not less." Most competitors focus on quitting or investing the savings. Your Daily Drain focuses on the smarter swap -- same fix, fraction of the cost.

Key headline:

"That $3 Monster cost you $4 to earn."

Tax assumption:

All calculations use 25% effective tax rate as default, adjustable by the user via a slider from 15% to 40%. This accounts for federal, state, and payroll taxes for a typical American worker. Every dollar spent on a habit costs more than face value because it was earned with pre-tax dollars.

Monetization:

Affiliate links on bulk purchases (Amazon, Sam's Club), experience and travel recommendations tied to savings amounts, and warehouse club membership referrals via Sam's Club Impact affiliate program.

Starting category:

Energy drinks. Specifically the gap between premium brands (Monster, Red Bull, Celsius, Alani Nu, Rockstar, Reign, Bang, Ghost, Prime) and value alternatives (Venom, Kirkland, ALDI store brand, Dollar Tree options, C4 bulk, Solimo). Coffee is the planned second category.

Design direction:

Dark, high energy, high contrast. Slightly edgy but clean. Energy drink culture meets financial clarity tool. Bold typography using Bebas Neue for headlines and DM Sans for body text. Animate the annual cost number counting up when results appear. Mobile first.

Data structure:

All drink pricing data lives in a drinks.json file so prices can be updated without touching code. Two arrays: name brands and value alternatives. Each entry includes brand name, can size in oz, caffeine mg, sugar grams, estimated convenience store price, estimated Walmart/Target price, and where to buy link.

What the research documents contain:

Accurate per-can pricing across all major brands and value alternatives, caffeine content per dollar, channel pricing (convenience vs grocery vs mass retail), and which value brands are currently available at which retailers.

