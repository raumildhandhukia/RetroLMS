import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import CoursesSidebar from './CoursesSidebar';
import Card from './Card';
import asulogo from '../../asu.png'
import CourseDetailPage from '../Other/CourseDetailPage';
import Leaderboard from '../Leaderboard/Leaderboard';
import Tasks from '../Task/Tasks';
import Items from '../Shop/Items';
import CreateCourse from './CreateCourse';
import DeletePrompt from './DeletePrompt';
import Profile from './Profile';
import Students from './Students';

export interface Course {
    _id: string;
    title: string;
    courseKey: string;
    details: string;
}

export interface ISidebarItem {
    name: "Account" | "Logout" | "MyCourses" | "Dashboard" | "Notifications";
}



const Dashboard: React.FC = () => {
    const [role, setRole] = useState<string>('');
    const [currency, setCurrency] = useState<number|null>(null);

    useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Make a request to the server to check the authentication status
        const response = await fetch("http://localhost:8080/check-auth", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        }); 
        const data = await response.json();

        if (!response.ok) {
          navigate("/login");
        } else if (data.role === "student" && data.resetPassword) {
          navigate("/createPassword");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
  }, []);
    useEffect(() => {
      const checkProfile = async () => {
        try {
          const response = await fetch("http://localhost:8080/profile", {
            method: "GET",
            credentials: "include", // Include cookies in the request
          });
          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
            setCurrency(data.currency);

          } else {
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error checking for profile", error);
        }
      };
  
      checkProfile();
    }, []);
    const [courses, setCourses] = useState<Course[]>([]);
    const updateCourses = (courseId: string, title: string, courseKey: string, details: string) => {
        const updatedCourses = courses.map(course => {
            if (course._id === courseId) {
                course.title = title;
                course.courseKey = courseKey;
                course.details = details;
            }
            return course;
        });
        setCourses(updatedCourses);
    }
    
    useEffect(() => {
    const getCourses = async () => {
        try {
            const response = await fetch('http://localhost:8080/coursesById', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const res: Course[] = await response.json();
            console.log("Fetched courses:", res);
            setCourses(res);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };
    getCourses();
}, []);


    const sidebarItems: ISidebarItem[] = [
        { name: "Account" },
        { name: "Dashboard"},
        { name: "MyCourses" },
        { name: "Logout" },
        { name: "Notifications"}
    ]
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<React.ReactNode | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string>();
    const [selectedItem, setSelectedItem] = useState<string>('Home');
    
    const navigate = useNavigate();

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    const handleCourseClick = (_id: string) => {
        setSelectedCourse(_id);
        setSelectedItem('Home');
    };

   
    const menuItems = role === 'student' ? 
                    ['Home', 'Task', 'Leaderboard', 'Shop'] : 
                    ['Home', 'Task', 'Leaderboard', 'Shop', 'Students', 'Delete'];

    const handleCourseCreate = () => {
        setSelectedItem('CreateCourse');
        setSelectedCourse('');
    };

    const handleItemClick = (item: string) => {
        setSelectedItem('');
        setTimeout(() => {
            setSelectedItem(item);
        } , 0);

    };

    const handleLogOut = async () => {
        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/login');
            } else {
                console.log('Error logging out');
            }
        } catch (error) {
            console.error('Error logging out', error);
        }
    }
    
    const handleIconClick = (iconName: string) => {
        switch (iconName) {
            case 'Account':
                console.log('Account clicked');
                setSelectedComponent(
                <div className='overlay-profile'><Profile 
                    onClose={handleCloseSidebar} 
                    /></div>
                );
                setSidebarOpen(!isSidebarOpen);
                break;
            case 'MyCourses':
                setSelectedComponent(
                <div className='overlay-courses'>
                    <CoursesSidebar 
                        onClose={handleCloseSidebar} 
                        courses={courses} 
                        onCourseClick={handleCourseClick}
                        setComponent={handleCourseCreate}
                        role={role}
                        /></div>
                    );
                setSidebarOpen(!isSidebarOpen);
                break;
            case 'Logout':
                setSidebarOpen(false);
                // navigate('/login');
                handleLogOut();
                break;
            case 'Dashboard':
                setSelectedComponent(null);
                setSelectedCourse('');
                setSelectedItem('');
                setSidebarOpen(false);
                break;
            default:
                setSelectedComponent(null);
                break;
        }
    };

    return (
        <div className="container flex">
          <div className="w-20 bg-gray-100 h-lvh flex flex-col" style={{
            position: 'fixed',
          }}>
             <img src={asulogo} />
              {sidebarItems.map(sidebarItem =>
                  <SidebarItem key={sidebarItem.name} name={sidebarItem.name} onClick={handleIconClick} role={role}/>
              )}
          </div>
           {isSidebarOpen && (
                <>
                    {selectedComponent}
                </>
            )}
            <div className="flex flex-1 p-10 flex-col" style={{

            }}>
            {selectedCourse ? (<div>
                    <div style={{position:'fixed', marginLeft:'20vh', marginBottom:'20%'}}>
                    <p className='text-2xl'>{courses.filter(course => course._id === selectedCourse)[0].courseKey}</p>
                    <hr/>
                     {/* {role === 'student' ? (
                        <div className='text-2xl'>Balance: $ {currency}</div>
                     ) : null} */} {/* Removed this part temporarily as it is not re-rendering */}
                    </div>
                
                <div className='main-content'>
                    
                    <div style={{position:'fixed', marginLeft:'20vh', marginTop:'10vh'}}>
                        {menuItems.map((item, index) => <div className='text-1xl custom-styling' 
                        onClick={
                            () => handleItemClick(item)
                        }>{item}</div>)}
                    </div>
                    <div className='detail-container' style={{marginLeft:'47vh'}}>
                    {selectedItem === 'Home' && <CourseDetailPage course={courses.filter(course => course._id === selectedCourse)[0]} updateCourses={updateCourses}/>}
                    {selectedItem === 'Leaderboard' && <Leaderboard courseId={selectedCourse}/>}
                    {selectedItem === 'Task' && <Tasks courseId = {selectedCourse} role={role}/>}
                    {selectedItem === 'Shop' && <Items role={role} courseId={selectedCourse} studentBalance={currency || 0}/>}
                    {selectedItem === 'Delete' && <DeletePrompt handleBack={()=>{
                        setSelectedItem('Home');
                    }}
                    handleBackToDashboard={ () => {
                        setSelectedComponent(null);
                        const updatedCourses = courses.filter(course => course._id !== selectedCourse);
                        setCourses(updatedCourses);
                        setSelectedCourse('');
                        setSelectedItem('');
                        setSidebarOpen(false);
                    }}
                    courseId={selectedCourse}
                    />}
                    {selectedItem === 'Students' && <Students courseId={selectedCourse}/>}
                    </div>
                </div>
               
            </div>) : (
            selectedItem === 'CreateCourse' ? (<CreateCourse/>) : 
            (<div style={{
                marginLeft:'20vh'
            
            }}>
                <p className="text-3xl">Dashboard</p>
                <div className='w-full flex flex-wrap mt-10'>
                    {courses.map(course => <Card {...course} onCardClick={handleCourseClick}/>)}
                </div>
            </div>
            )
        ) }
            </div>
            {/* <Routes>
                <Route path="/dashboard/home" element={<Outlet />} />
            </Routes> */}
        </div>

    );
}

export default Dashboard;