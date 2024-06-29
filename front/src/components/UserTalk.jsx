import React from 'react'
import { FaUser } from 'react-icons/fa'

const UserTalk = ({ text }) => {
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex items-start gap-2.5 mb-10 justify-end">
      <div className="flex flex-col gap-1 w-full max-w-[500px]">
        <div class="flex items-center space-x-2 rtl:space-x-reverse justify-end">
          <span className="text-sm font-semibold text-gray-900">
            Usuário
          </span>
          <span className="text-sm font-normal text-gray-500">
            {getCurrentTime()}
          </span>
        </div>

        <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-s-xl rounded-ee-xl">
          <p className="text-base font-normal text-gray-900">
            {text}
          </p>
        </div>
      </div>

      <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2 bg-blue-700">
        <FaUser color="white" />
      </div>
    </div>
  )
}

export default UserTalk
