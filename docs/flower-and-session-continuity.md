# Flower and saved sign-ins

On 2026-09-14, existing private room 2 was renamed from Rose 🌹 to Flower with a guarded single-row update. No membership, invitation code, game, message, PIN or token changed.

Room titles now use a floral pink hibiscus treatment for Flower/Rose/Bloom names, a warm house treatment for the family room, and a moon for other private rooms. Applied to the room doorway, current-room label, Game Nook and game setup choices.

An API 401 no longer automatically deletes the saved token or renders login. The UI offers a reconnect notice with Retry and a user-chosen sign-in alternative. Server authorization still rejects invalid tokens; this is not an authentication bypass. Responses from an older token cannot erase or interrupt a newer login. Existing sign-in tokens remain stable during ordinary deployments and re-login; deliberate PIN resets still revoke them. Browser data deletion or actual credential revocation may require signing in again.

Verified with session-preservation.cjs, game-setup.cjs and game-nook.cjs. Production rename readback returned Flower for room 2.
