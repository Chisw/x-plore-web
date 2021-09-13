import { useRecoilState } from 'recoil'
import { notificationListState } from '../utils/state'

export default function Notification() {

  const [notificationList, setNotificationList] = useRecoilState(notificationListState)


  return (
    <>
      <div className="fixed z-10 top-0 right-0 mt-10 mr-4">
        {notificationList.map(({ id, icon, title, content }) => {
          return (
            <div
              key={id}
              className="w-56 p-4 bg-white-900 bg-hazy-100 rounded-lg shadow-md"
            >
              {title}
            </div>
          )
        })}
      </div>
    </>
  )
}