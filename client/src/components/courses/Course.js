import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Header, Button, Loader, Icon } from 'semantic-ui-react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import roles from '../../util/user_roles';
import { COURSE_BY_ID, DELETE_COURSE, COURSE_REGISTRATION } from '../../GqlQueries';
import Registration from '../registration/Registration';
import CourseRegistration from '../../admin/CourseRegistrations';
import Groups from './Groups';

export default ({ id }) => {
  const [courses, setCourses] = useStore('coursesStore');
  const [user] = useStore('userStore');
  const [course, setCourse] = useState({});
  const [seeGroups, setSeeGroups] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [deleteCourse] = useMutation(DELETE_COURSE);
  const history = useHistory();

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id },
  });

  const { loading: regLoading, data: regData } = useQuery(COURSE_REGISTRATION, {
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
      setRegistrations(
        regData.courseRegistrations.map(r => {
          r.questionAnswers.sort((a, b) => a.question.order - b.question.order);
          r.questionAnswers.forEach(qa => qa.answerChoices.sort((a, b) => a.order - b.order));

          return r;
        })
      );
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

  const handleSeeGroups = () => {
    setSeeGroups(!seeGroups);
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
      <h2>{`${course.code} -${course.title}`}</h2>
      {user && user.role === roles.ADMIN_ROLE ? (
        <Button onClick={handleDeletion} color="red">
          <FormattedMessage id="course.delete" />
        </Button>
      ) : null}
      {userIsRegistered() ? (
        <Header as="h2">
          <Icon name="thumbs up outline" />
          <Header.Content>
            <FormattedMessage id="course.userHasRegistered" />
          </Header.Content>
        </Header>
      ) : (
        <>
          <Header as="h4" color="red">
            <FormattedMessage id="course.deadline" />
            <FormattedDate value={course.deadline} />
          </Header>
          <div>{course.description}</div>
          <h3>
            <FormattedMessage id="course.questionsPreface" />
          </h3>
          <Registration courseId={course.id} questions={course.questions} />
        </>
      )}
      <div>
        {course.questions && registrations && user.role === roles.ADMIN_ROLE ? (
          <div>
            <CourseRegistration course={course} registrations={registrations} />
            <p />
            <Button toggle active={seeGroups} onClick={handleSeeGroups}>
              <FormattedMessage id="course.seeGroups" />
            </Button>
            {seeGroups ? <Groups courseId={id} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
