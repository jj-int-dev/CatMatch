export default function (accessToken: string, refreshToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Refresh-Token': refreshToken
  };
}
