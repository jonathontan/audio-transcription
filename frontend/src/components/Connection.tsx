import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { type Health } from "../interfaces/health";
import styles from "./Connection.module.css";
import getHealth from "../services/healthService";

function Connection() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await getHealth();
        setHealth(response);
      } catch (e: unknown) {
        if (e instanceof Error) throw new Error(e.message);
      }
    };
    setTimeout(() => fetchHealth(), 3000);
  }, []);

  const getStatusColor = () => {
    switch (health?.status) {
      case "running":
        return "#1bff07";
      case "stop":
        return "#fd0000";
      default:
        return "gray";
    }
  };

  return (
    <div className={styles.container}>
      <Icon
        className={styles.icon}
        icon="icon-park-outline:dot"
        fontSize={24}
        color={getStatusColor()}
      />
      {health?.database.toUpperCase() || "Connecting..."}
    </div>
  );
}

export default Connection;
