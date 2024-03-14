interface IParams {
  id?: string;
}

const StaffBookingDetailPage = ({params}: { params: IParams }) => {

  let id = params.id

  return (
    <div>StaffBookingDetailPage</div>
  )
}

export default StaffBookingDetailPage