import React from 'react'
import ProfileSubscribe from '../../components/generic/profile/ProfileSubscribe'
import { useParams } from 'react-router-dom';
//debug but still not working - oke lol Sang
const ProfileSubscribeManagement: React.FC = () => {
    const instructorId = useParams().instructorId;
    return (
        <ProfileSubscribe instructorId={instructorId as string} />
    )
}

export default ProfileSubscribeManagement