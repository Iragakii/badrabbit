# Migration Guide: Replacing Hardcoded localhost URLs

This guide helps you replace all hardcoded `localhost:8081` URLs with the environment-aware API configuration.

## Quick Migration Steps

1. **Import the API helper** in files that use `fetch` or `axios`:
   ```typescript
   import { getApiUrl } from '../config/api';
   // or
   import { API_BASE_URL } from '../config/api';
   ```

2. **Replace fetch calls**:
   ```typescript
   // Before
   fetch('http://localhost:8081/api/items')
   
   // After
   import { getApiUrl } from '../config/api';
   fetch(getApiUrl('api/items'))
   ```

3. **For axios**, it's already configured in `AuthContext.tsx` to use `API_BASE_URL`.

## Files That Need Updates

The following files still have hardcoded URLs and should be updated:

### High Priority (Core Functionality)
- `frontend/src/Modal/ModalCreateNFT/ModalCreateNFT.tsx`
- `frontend/src/Modal/ModalItemDetail/ModalItemDetail.tsx`
- `frontend/src/Modal/ModalMakeOffer/ModalMakeOffer.tsx`
- `frontend/src/Layout/ProfileLayout/ProfileItemsUI/ProfileItemsUiCPN/ScreenTwo/CardCPN/Mansory/ItemsGrid.tsx`
- `frontend/src/Layout/ProfileLayout/ProfileItemsUI/ProfileItemsUiCPN/ProfileSecFilterItem.tsx`
- `frontend/src/Layout/ProfileLayout/ProfileCreatedUI.tsx/CreatedCollectionUICPN/CreatedCollectRightUI.tsx`
- `frontend/src/Layout/CreateCollectionLayout/CreateCollectionLayoutCPN/BtnPublishContractColle.tsx`

### Medium Priority
- `frontend/src/HomePage/ScreenTwo/TrendingTokens/TrendingTokenCardDetail.tsx/TrendingCard.tsx`
- `frontend/src/Layout/ProfileLayout/ProfilleUICPN/ProfileNav/ProfileNavCPN/BtnCreated.tsx`
- `frontend/src/Layout/ProfileLayout/ProfileSettingUICPN/EditSideSetiingUI/EditSideSettingCPN/ButtonConnectX.tsx`
- `frontend/src/Layout/ProfileLayout/ProfileSettingUICPN/EditSideSetiingUI/EditSideSettingCPN/ButtonDisconectX.tsx`

## Example Migration

### Example 1: Simple fetch
```typescript
// Before
const response = await fetch('http://localhost:8081/api/items');

// After
import { getApiUrl } from '../config/api';
const response = await fetch(getApiUrl('api/items'));
```

### Example 2: fetch with query params
```typescript
// Before
const response = await fetch(`http://localhost:8081/api/items/owner/${walletaddress}`);

// After
import { getApiUrl } from '../config/api';
const response = await fetch(getApiUrl(`api/items/owner/${walletaddress}`));
```

### Example 3: POST request
```typescript
// Before
const response = await fetch('http://localhost:8081/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

// After
import { getApiUrl } from '../config/api';
const response = await fetch(getApiUrl('api/items'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

## Automated Migration Script

You can use find/replace in your IDE:
- Find: `http://localhost:8081`
- Replace with: (use getApiUrl helper manually, as it requires import statements)

Or use this regex pattern to find all instances:
```
http://localhost:8081
```

## Testing After Migration

1. Set `VITE_API_BASE_URL=http://localhost:8081` in `.env` for local development
2. Test all API calls work correctly
3. For production, set `VITE_API_BASE_URL` to your Render backend URL

