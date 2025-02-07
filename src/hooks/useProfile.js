import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  createProfile,
  deleteProfile,
  fetchProfileDetails,
  fetchProfileLogDetail,
  fetchProfiles,
  updateProfile,
} from "../actions/profileActions";
import { deselectProfile as removeProfile } from "../slices/profileSlice";

export const useProfile = () => {
  const dispatch = useDispatch();
  const { loading, error, profiles, selectedProfile } = useSelector(
    (state) => state.profile
  );

  const [activityLoader, setActivityloader] = useState(true);

  useEffect(() => {
    if (activityLoader && !profiles && !error && !loading) {
      dispatch(fetchProfiles());
      setActivityloader(false);
    }
  }, [dispatch, activityLoader, loading, profiles, error]);

  const handleCreate = (profile) => {
    return dispatch(createProfile(profile));
  };

  const handleUpdate = (profileId, profile) => {
    return dispatch(updateProfile({ profileId, profile }));
  };

  const handleDelete = (profileId) => {
    return dispatch(deleteProfile(profileId));
  };

  const selectProfile = (profileId) => {
    if (profileId) {
      dispatch(fetchProfileDetails(profileId));
    }
  };

  const handleLogDetails = (profileId) => {
    if (profileId) {
      dispatch(fetchProfileLogDetail(profileId));
    }
  };

  const deselectProfile = () => {
    if (selectedProfile) {
      dispatch(removeProfile());
    }
  };

  return {
    loading,
    error,
    profiles,
    selectedProfile,
    handleCreate,
    handleUpdate,
    handleDelete,
    selectProfile,
    deselectProfile,
    handleLogDetails,
  };
};
