import { User } from '@prisma/client'
import { AvatarProps } from '@radix-ui/react-avatar'
import { FC } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { Icons } from './Icons'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className='relative aspect-square h-full w-full'>
          <Image src={user.image} fill alt='Profile image' />
        </div>
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{user.name}</span>
          <Icons.user className='w-4 h-4' />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar
