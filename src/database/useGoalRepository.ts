import { useSQLiteContext } from "expo-sqlite/next";

export type GoalCreateDatabase = {
  name: string
  total: number
}


export type GoalResponse = {
  id: string
  name: string
  total: number
  current: number
}

export function useGoalRepository(){
  const database = useSQLiteContext()

  function create(goal: GoalCreateDatabase){
    try{
      // INSERT INTO goals: Este é o comando que indica a ação de inserção de dados. goals é o nome da tabela onde os dados serão inseridos.
      const statement = database.prepareSync(
        "INSERT INTO goals (name, total) VALUES ($name, $total)" // Inserindo na tabela
      )
  
      statement.executeSync({ // Passando o conteudo do parametro paras as variaveis $name e $total
        $name: goal.name,
        $total: goal.total
      })
    } catch(error){
      throw error
    }
  }

  function all(){
    try{
      // Esse COALESCE pega a soma da coluna de amount das transações
      return database.getAllSync<GoalResponse>(`
      SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
      FROM goals AS g
      LEFT JOIN transactions t ON t.goal_id = g.id 
      GROUP BY g.id, g.name, g.total
      `) // Pegando as informações do banco
    }catch(error){
      throw error
    }
  }

  function show(id: number){
    const statement = database.prepareSync(`
    SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
    FROM goals AS g
    LEFT JOIN transactions t ON t.goal_id = g.id 
    WHERE g.id = $id
    GROUP BY g.id, g.name, g.total
    `) // Pegando uma informação especifica

    const result = statement.executeSync<GoalResponse>({ $id: id })

    return result.getFirstSync()
  }

  return {
    create,
    all,
    show
  }
}