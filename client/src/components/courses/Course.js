import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Loader } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import roles from '../../util/user_roles';
import { COURSE_BY_ID, DELETE_COURSE, COURSE_REGISTRATION } from '../../GqlQueries';
import GroupsView from './GroupsView';
import RegistrationList from './RegistrationList';

export default ({ id }) => {
  const [courses, setCourses] = useStore('coursesStore');
  const [user] = useStore('userStore');
  const [course, setCourse] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [regByStudentId, setRegByStudentId] = useState([]);
  const [deleteCourse] = useMutation(DELETE_COURSE);
  const [groupsView, setGroupsView] = useState(false);
  const history = useHistory();

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id },
  });

  const { loading: regLoading, data: regData } = useQuery(COURSE_REGISTRATION, {
    skip: user.role !== roles.ADMIN_ROLE,
    variables: { courseId: id },
  });

  useEffect(() => {
    if (!loading && data !== undefined) {
      setCourse({
        ...data.course,
        questions: data.course.questions.sort((a, b) => a.order - b.order),
      });
    }

    if (!regLoading && regData !== undefined) {
      const reg  = regData.courseRegistrations.map(r => {
          r.questionAnswers.sort((a, b) => a.question.order - b.question.order);
          r.questionAnswers.forEach(qa => qa.answerChoices.sort((a, b) => a.order - b.order));

          return r;
        })
      setRegistrations(reg);
      setRegByStudentId(reg.reduce((acc, elem) => {
        acc[elem.student.studentNo] = elem;
        return acc;
      }, {}))
    }
  }, [data, loading, regData, regLoading]);

  if (error !== undefined) {
    console.log('error:', error);
    return <div>Error loading course</div>;
  }

  if (loading || !course) {
    return <Loader active />;
  }

  const handleDeletion = async () => {
    const variables = { id };
    if (window.confirm('Delete course?')) {
      try {
        await deleteCourse({
          variables,
        });
        const trimmedCourses = [];

        courses.forEach(remainingCourse => {
          if (remainingCourse.id !== id) {
            trimmedCourses.push(remainingCourse);
          }
        });
        setCourses(trimmedCourses);
      } catch (deletionError) {
        console.log('error:', deletionError);
      }
      history.push('/courses');
    }
  };

  const handleGroupsView = () => {
    setGroupsView(!groupsView);
  };

  const userIsRegistered = () => {
    const found = user.registrations.find(r => r.course.id === course.id);

    if (found === undefined) {
      return false;
    }

    return true;
  };

  return (
    <div>
      <h2>{`${course.code} - ${course.title}`}</h2>
      {user && user.role === roles.ADMIN_ROLE ? (
        <div>
          {!groupsView ? (
            <div>
              <div>
                <Button onClick={handleGroupsView} color="blue">
                  <FormattedMessage id="course.switchGroupsView" />
                </Button>
              </div>
              <p />
              <div>
                <Button onClick={handleDeletion} color="red" data-cy="delete-course-button">
                  <FormattedMessage id="course.delete" />
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleGroupsView} color="blue">
              <FormattedMessage id="course.switchCourseView" />
            </Button>
          )}
        </div>
      ) : null}
      <p />
      {groupsView ? (
        <GroupsView course={course} registrations={registrations} regByStudentId={regByStudentId} />
      ) : (
        <RegistrationList
          userIsRegistered={userIsRegistered}
          course={course}
          registrations={registrations}
          user={user}
        />
      )}
    </div>
  );
};
