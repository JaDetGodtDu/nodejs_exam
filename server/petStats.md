## **Pets have the following stats:**

- **type**: Random number between 1 and 10, determines visual appearance in the frontend.
- **hunger**: Max 100. Decreases over time. When hunger reaches 0, health starts to decay faster.
- **happiness**: Max 100. Decreases over time. Low happiness affects energy.
- **health**: Max 100. Decreases if hunger is low. If health reaches 0, the pet is dead.
- **energy**: Max 100. Decreases over time. If energy is 0, the pet can't play.

## **Stat Decay Logic:**

- Every hour, hunger, happiness, and energy decrease by 2.
- If hunger drops to 50 or below, health, energy, and happiness decay faster.
- If hunger drops to 25 or below, decay is even faster.
- If hunger is 0, health, energy, and happiness decay the fastest.
- If happiness is 0, energy decays faster.
- All decay is updated every minute, but calculated based on hours passed since last update.

## **Pets can perform the following actions:**

- **feed**: +10 to hunger (max 100). Can't feed if already full.
- **pet**: +5 to happiness (max 100).
- **play**: -5 to energy, +10 to happiness. Can't play if energy ≤ 5.
- **heal**: +10 to health (max 100). Can't heal if already healthy.
- **rest**: +10 to energy (max 100). Can't rest if already full energy or if happiness is 0.