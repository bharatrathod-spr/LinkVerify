import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helpers/axiosInstance";
import { rejectAction } from "./rejectAction";

const transformData = (data) => {
  if (!data?.length) return [];
  const profileSet = new Set();

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key.includes("success") || key.includes("failure")) {
        profileSet.add(key.replace(/_(success|failure)$/, ""));
      }
    });
  });

  const profiles = Array.from(profileSet);

  return data.map((item) => {
    const transformedItem = { date: item.date };
    profiles.forEach((profile) => {
      transformedItem[`${profile}`] =
        item[`${profile}_failure`] > 0
          ? -item[`${profile}_failure`]
          : item[`${profile}_success`] || 0;
      transformedItem[`${profile}_id`] = item[`${profile}_id`];
      transformedItem[`${profile}_description`] =
        item[`${profile}_description`];
    });

    return transformedItem;
  });
};

export const fetchUserData = createAsyncThunk(
  "dashboard/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/user_dashboard");

      const graphdata =
        {
          successFailureGraph:
            transformData(response.data?.successFailureData || [])?.reverse() ||
            [],
          responseTimeGraph: response.data?.responseTimeData?.reverse() || [],
        } || {};

      const pannelData = response.data?.lastErrors || [];

      return { graphdata, pannelData };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

// Helper function to format the month to a readable name
const formatMonth = (month) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = parseInt(month, 10) - 1;
  return monthNames[monthIndex];
};

const allMonths = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export const fetchSuperUserData = createAsyncThunk(
  "dashboard/fetchSuperUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/dashboard");

      const graphdata = response.data?.monthlyArrivals || [];
      const activeCount = response.data?.activeCount || 0;
      const inactiveCount = response.data?.inactiveCount || 0;

      const formattedData = allMonths.map((month) => {
        const existingData = graphdata.find((data) => data?.month === month);
        return {
          month: formatMonth(month),
          thisYear: existingData ? existingData.thisYear : 0,
          lastYear: existingData ? existingData.lastYear : 0,
        };
      });

      const userCount = {
        active: activeCount,
        inactive: inactiveCount,
      };

      const pannelData = [];

      return { graphdata: formattedData, userCount, pannelData };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);
