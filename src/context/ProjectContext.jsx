import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "./AuthContext.jsx";

import {
  saveCloudData,
  subscribeCloudData,
} from "../services/firestore.js";

const ProjectContext = createContext(null);

const DEFAULT_DATA = {
  project: {
    projectName: "",
    startDebt: 0,
    startDate: "",
    monthlyIncome: 0,
    fixedExpense: 0,
    monthlyGoal: 0,
  },
  transactions: [],
};

function createEmptyData() {
  return {
    project: { ...DEFAULT_DATA.project },
    transactions: [],
  };
}

function makeId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function ProjectProvider({ children }) {
  const { user, authLoading } = useAuth();

  const [data, setData] = useState(createEmptyData);
  const [dataLoading, setDataLoading] = useState(true);
  const [syncError, setSyncError] = useState("");

  const cloudReadyRef = useRef(false);
  const receivingCloudRef = useRef(false);

  useEffect(() => {
    if (authLoading) {
      return undefined;
    }

    if (!user?.uid) {
      cloudReadyRef.current = false;
      receivingCloudRef.current = false;
      setData(createEmptyData());
      setDataLoading(false);
      setSyncError("");

      return undefined;
    }

    setDataLoading(true);
    setSyncError("");
    cloudReadyRef.current = false;
    receivingCloudRef.current = false;

    const unsubscribe = subscribeCloudData(
      user.uid,

      (cloudData) => {
        receivingCloudRef.current = true;

        setData({
          project: {
            ...DEFAULT_DATA.project,
            ...(cloudData.project ?? {}),
          },

          transactions: Array.isArray(
            cloudData.transactions,
          )
            ? cloudData.transactions
            : [],
        });

        cloudReadyRef.current = true;
        setDataLoading(false);
      },

      async () => {
        const emptyData = createEmptyData();

        setData(emptyData);
        cloudReadyRef.current = true;
        setDataLoading(false);

        try {
          await saveCloudData(user.uid, emptyData);
        } catch (error) {
          console.error(
            "최초 Firestore 저장 실패:",
            error,
          );

          setSyncError(
            "클라우드에 초기 데이터를 저장하지 못했습니다.",
          );
        }
      },

      (error) => {
        console.error(
          "Firestore 실시간 구독 실패:",
          error,
        );

        setSyncError(
          "클라우드 데이터를 불러오지 못했습니다.",
        );

        setDataLoading(false);
      },
    );

    return unsubscribe;
  }, [user?.uid, authLoading]);

  useEffect(() => {
    if (
      !user?.uid ||
      !cloudReadyRef.current ||
      dataLoading
    ) {
      return;
    }

    if (receivingCloudRef.current) {
      receivingCloudRef.current = false;
      return;
    }

    saveCloudData(user.uid, data).catch((error) => {
      console.error(
        "Firestore 저장 실패:",
        error,
      );

      setSyncError(
        "클라우드에 변경사항을 저장하지 못했습니다.",
      );
    });
  }, [data, user?.uid, dataLoading]);

  function setProject(project) {
    setData((current) => ({
      ...current,

      project: {
        ...current.project,
        ...project,
      },
    }));
  }

  function addTransaction(transaction) {
    setData((current) => ({
      ...current,

      transactions: [
        ...current.transactions,

        {
          ...transaction,
          id: makeId(),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }

  function updateTransaction(
    id,
    updatedTransaction,
  ) {
    setData((current) => ({
      ...current,

      transactions: current.transactions.map(
        (transaction) =>
          transaction.id === id
            ? {
                ...transaction,
                ...updatedTransaction,
                updatedAt:
                  new Date().toISOString(),
              }
            : transaction,
      ),
    }));
  }

  function deleteTransaction(id) {
    setData((current) => ({
      ...current,

      transactions:
        current.transactions.filter(
          (transaction) =>
            transaction.id !== id,
        ),
    }));
  }

  function resetAll() {
    setData(createEmptyData());
  }

  const value = useMemo(
    () => ({
      project: data.project,
      transactions: data.transactions,

      dataLoading,
      syncError,

      setProject,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      resetAll,
    }),
    [data, dataLoading, syncError],
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useProject는 ProjectProvider 안에서 사용해야 합니다.",
    );
  }

  return context;
}