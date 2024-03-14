export const domain = 'https://hotel-tma.zeabur.app/'

interface IParams {
  roomId?: string;
}

export default async function getRoomById(
  params: IParams
) {
  try {
    const {roomId} = params;

    if (!roomId) {
      return null;
    }

    return fetch(`${domain}api/room/${roomId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    }).then((res) => {
      return res.json()
    }).catch((error) => {
      console.log(error)
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
