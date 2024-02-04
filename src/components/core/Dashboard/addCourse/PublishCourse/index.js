import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import IconBtn from "../../../../common/IconBtn";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../data/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsApi";

const PublishCourse = () => {
  const {
    register,
    getValues,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm();
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(course?.status === COURSE_STATUS.PUBLISHED){
      setValue("public",true);
    }
  },[]);
  

  const goToCourses = ()=>{
    dispatch(resetCourseState());
    // navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async() => {
    if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public") ===  true || 
    course?.status === COURSE_STATUS.DRAFT && getValues("public") === false ){
      // form not updated so no need to call Api for publish course and just show all courses
      goToCourses();
      return;
    }
    // if form updated
    const formData = new FormData();
    formData.append("courseId",course._id);
    const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
    formData.append("status",courseStatus);

    setLoading(true);

    const result = await editCourseDetails(formData,token);
    if(result){
      goToCourses();
    }
    setLoading(false);
  }

  const onSubmit = () => {
    handleCoursePublish();
  };
  const goBack = () => {
    dispatch(setStep(2));
  };
  return (
    <div className="rounded-md border-[1px] bg-richblack-800 border-richblack-700 text-white">
      <h1>Publish Course</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="public">
            {" "}
            <input
              type="checkbox"
              id="public"
              {...register("public", { required: true })}
              className="rounded h-4 w-4 "
            />{" "}
            <span className="ml-3">Make this course as public </span>
          </label>
        </div>

        <div className="flex flex-row-reverse gap-4">
          <button 
          disabled={loading}
          type='button'
          onClick={goBack}
          className="flex items-center rounded-md bg-richblack-500 px-8 py-3">
          Back
          </button>
          <IconBtn disabled={loading} text={"save changes"}/>
        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
