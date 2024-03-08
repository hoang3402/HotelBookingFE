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
    
    return fetch(`${process.env.API_URL}api/room/${roomId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.json()
    }).catch((error) => {
      console.log(error)
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
