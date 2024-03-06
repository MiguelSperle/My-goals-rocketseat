import { useSQLiteContext } from "expo-sqlite/next";

type TransactionCreateDataBase = {
  amount: number
  goalId: number
}

type TransactionResponse = {
  id: string
  amount: number
  goal_id: number
  created_at: number
}

export function useTransactionRepository(){
  const database = useSQLiteContext()

  function findLatest(){
    try {
      // SELECT * FROM transactions: seleciona todas as colunas de todos os registros da tabela transactions.
      return database.getAllSync<TransactionResponse>(
        `SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10`
      )
    } catch(error){
      throw error
    }
  }

  function findGoal(goalId: number){
    try{
      // SELECT * FROM transactions: seleciona todas as colunas de todos os registros da tabela transactions.
      const statement = database.prepareSync(
        `SELECT * FROM transactions WHERE goal_id = $goal_id`
      )

      const result = statement.executeSync<TransactionResponse>({
        $goal_id: goalId
      })

      return result.getAllSync()
    }catch(error){
      throw error
    }
  }

  function create(transaction: TransactionCreateDataBase){
    try{
      // INSERT INTO transactions: Este é o comando que indica a ação de inserção de dados. transactions é o nome da tabela onde os dados serão inseridos.
      const statement = database.prepareSync(
        `INSERT INTO transactions (amount, goal_id) VALUES ($amount, $goal_id)`
      )

      statement.executeSync({
        $amount: transaction.amount,
        $goal_id: transaction.goalId
      })
    }catch(error){
      throw error
    }
  }
   
  return {
    findLatest,
    findGoal,
    create
  }
}