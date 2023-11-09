// Importing necessary React hooks and types from external libraries.
import { useEffect, useState, createContext, useContext } from "react";
import {
  useUser as useSupaUser,
  useSessionContext,
  User,
} from "@supabase/auth-helpers-react";

// Importing custom types from a local module.
import { UserDetails, Subscription } from "@/types";

// Defining the structure of the UserContext.
type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

// Creating the UserContext using createContext.
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Defining the type for the component props.
export interface Props {
  [propName: string]: any;
}

// Creating the provider component for the UserContext.
export const MyUserContextProvider = (props: Props) => {
  // Destructuring values from the useSessionContext hook.
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();

  // Getting user information using the useSupaUser hook.
  const user = useSupaUser();

  // Extracting access token from the session or defaulting to null.
  const accessToken = session?.access_token ?? null;

  // State variables to manage loading state, user details, and subscription.
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Function to fetch user details from the 'users' table using Supabase.
  const getUserDetails = () => supabase.from("users").select("*").single();
  
  // Function to fetch subscription details from the 'subscriptions' table using Supabase.
  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*, prices(* , products(*))")
      .in("status", ["trailing", "active"])
      .single();

  // useEffect to fetch user details and subscription details when user is present and data is not already loaded.
  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      // Setting loading state to true.
      setIsLoadingData(true);

      // Fetching user details and subscription details concurrently using Promise.allSettled.
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          // Checking if user details fetch was successful.
          if (userDetailsPromise.status === "fulfilled") {
            setUserDetails(userDetailsPromise.value.data as UserDetails);
          }

          // Checking if subscription details fetch was successful.
          if (subscriptionPromise.status === "fulfilled") {
            setSubscription(subscriptionPromise.value.data as Subscription);
          }

          // Setting loading state to false.
          setIsLoadingData(false);
        }
      );
    }
    // Handling the case where the user is not present and data is not already loaded.
    else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  // Creating the value object to be provided by the context.
  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
  };

  // Providing the UserContext value to the children components.
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
    const context= useContext(UserContext);
    if(context === undefined){
        throw new Error('useUser must be used within MyUserContextProvider ');
    }

    return context;
}
