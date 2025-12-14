
import React from 'react'
import Profile from '../../HomePage/components/utils/Svgs/Profile'

import { useUserData } from '../../ContextProviders/User'


function UserProfile() {
  const {user}= useUserData()

  
  return (
    <div
            className={`rounded-2xl p-6 shadow-lg bg-white dark:bg-black dark:shadow-md dark:shadow-purple-400`}
          >
            <div className="text-center w-full h-fit">
              <div className='w-full h-fit flex flex-col gap-2 items-center'>
              <div className="inline-block w-[150px] h-[150px]  ">
                {
                  user.profilePicture?
<img
                  src={user.profilePicture}
                  alt="Profile"
                  className=" rounded-full mx-auto mb-4 object-cover w-full h-full"
                />
                :
 <Profile  className="w-full h-full" />
                }
              </div>
              <h2 className={`text-2xl font-bold text-neutral-300 dark:text-neutral-500 mb-2`}>
                {user.userName}
              </h2>
              <p className={`text-neutral-500 dark:text-neutral-400 mb-4`}>
                {user.email}
              </p>
              </div>
              <div className=" dark:divide-y-[1px] dark:divide-purple-400">
                <div className="flex justify-between items-end pt-4">
                  <span className="text-neutral-500 dark:text-neutral-400 ">
                    Member since :
                  </span>
                  <span className=" text-black dark:text-neutral-400 font-medium">
                    {user.joinDate}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Total meetings :
                  </span>
                  <span className="text-black dark:text-neutral-400 font-medium">
                    {user.totalMeetings}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Total hours :
                  </span>
                  <span className="text-black dark:text-neutral-400 font-medium">
                    {user.totalHours}
                  </span>
                </div>
                 <div className="flex justify-between items-end pt-4"> 
                </div>
              </div>
            </div>
          </div>

  )
}

export default UserProfile
