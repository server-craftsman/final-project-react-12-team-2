import React from 'react';
import { Tabs } from 'antd';
import InstructorInfo from '../../components/instructor/InstructorInfo';
import ChangePasswordInstructor from '../../components/instructor/ChangePasswordInstructor';

const { TabPane } = Tabs;

const Setting: React.FC = () => {
    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Instructor Info" key="1">
                <InstructorInfo />
            </TabPane>
            <TabPane tab="Change Password" key="2">
                <ChangePasswordInstructor />
            </TabPane>
        </Tabs>
    );
};

export default Setting;